#!/usr/bin/env python3
"""Compare the business DOM of two static builds.

usage: python3 scripts/dom-compare.py <before-dist> <after-dist>

Walks every .html file in both directories and compares elements, attributes (in order), and text.
Ignored as generated: Vue scope attributes (data-v-*), comments, <script>, <style>, <link>.
Exits 1 on any difference, printing the first few per page.
"""
import sys
from html.parser import HTMLParser
from pathlib import Path

SKIP = {'script', 'style', 'link'}


class Flat(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.items = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            if tag != 'link':
                self.skip += 1
            return
        if self.skip:
            return
        kept = [(k, v) for k, v in attrs if not k.startswith('data-v-')]
        self.items.append(('<' + tag, tuple(kept)))

    def handle_endtag(self, tag):
        if tag in SKIP:
            if tag != 'link' and self.skip:
                self.skip -= 1
            return
        if not self.skip:
            self.items.append(('</' + tag, ()))

    def handle_data(self, data):
        if not self.skip and data:
            self.items.append(('#text', data))


def flat(path):
    parser = Flat()
    parser.feed(path.read_text(encoding='utf-8'))
    merged = []
    for item in parser.items:
        if merged and item[0] == '#text' and merged[-1][0] == '#text':
            merged[-1] = ('#text', merged[-1][1] + item[1])
        else:
            merged.append(item)
    return merged


def main():
    before, after = Path(sys.argv[1]), Path(sys.argv[2])
    names = sorted(str(p.relative_to(before)) for p in before.rglob('*.html'))
    other = sorted(str(p.relative_to(after)) for p in after.rglob('*.html'))
    bad = 0
    if names != other:
        print('page sets differ:', sorted(set(names) ^ set(other)))
        bad += 1
    for name in sorted(set(names) & set(other)):
        a, b = flat(before / name), flat(after / name)
        if a == b:
            continue
        bad += 1
        print(f'DIFF {name}: {len(a)} vs {len(b)} nodes')
        shown = 0
        for i, (x, y) in enumerate(zip(a, b)):
            if x != y:
                print(f'  at {i}: {x!r} != {y!r}')
                shown += 1
                if shown == 3:
                    break
    print(f'{len(set(names) & set(other))} pages compared, {bad} differ')
    sys.exit(1 if bad else 0)


main()
