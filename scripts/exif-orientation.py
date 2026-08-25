#!/usr/bin/env python3
"""Print a JPEG's EXIF orientation (1-8), or "none" if it has no such tag.

Exists because this machine has no exiftool/ImageMagick/Pillow, and
optimize-photos.sh must not re-encode a rotated photo into a sideways one.
Values other than 1 mean the viewer is expected to rotate/flip the pixels.
Anything unreadable is reported as "none" — a plain baseline JPEG.
"""

import struct
import sys

ORIENTATION_TAG = 0x0112


def orientation(path):
    with open(path, "rb") as fh:
        data = fh.read(256 * 1024)  # EXIF lives in the first APP1 segment
    if data[:2] != b"\xff\xd8":
        return "none"  # not a JPEG (e.g. a PNG) — nothing to preserve
    i = 2
    while i < len(data) - 4:
        if data[i] != 0xFF:
            return "none"
        marker = data[i + 1]
        if marker == 0xDA:  # start of scan: past every header
            return "none"
        length = struct.unpack(">H", data[i + 2 : i + 4])[0]
        if marker == 0xE1 and data[i + 4 : i + 10] == b"Exif\x00\x00":
            return _read_ifd0(data[i + 10 : i + 2 + length])
        i += 2 + length
    return "none"


def _read_ifd0(tiff):
    endian = ">" if tiff[:2] == b"MM" else "<"
    offset = struct.unpack(endian + "I", tiff[4:8])[0]
    count = struct.unpack(endian + "H", tiff[offset : offset + 2])[0]
    for n in range(count):
        entry = offset + 2 + n * 12
        tag = struct.unpack(endian + "H", tiff[entry : entry + 2])[0]
        if tag == ORIENTATION_TAG:
            return struct.unpack(endian + "H", tiff[entry + 8 : entry + 10])[0]
    return "none"


if __name__ == "__main__":
    try:
        print(orientation(sys.argv[1]))
    except (IndexError, struct.error, OSError):
        print("none")
