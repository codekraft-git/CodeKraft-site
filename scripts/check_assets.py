import os
import re

files = [
    'components/codekraft/studio.tsx',
    'components/codekraft/brand.tsx',
    'components/codekraft/cosmic-backdrop.tsx',
    'components/core/infinite-slider-basic.tsx',
    'app/layout.tsx'
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as fh:
            content = fh.read()
            srcs = re.findall(r'src=[\'"]([^\'"]+)[\'"]', content)
            for s in srcs:
                if s.startswith('/'):
                    rel = s.lstrip('/')
                    exists = os.path.exists(os.path.join('public', rel))
                    print(f'{f} -> {s}: exists={exists}')
