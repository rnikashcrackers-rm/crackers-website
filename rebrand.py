import os

root = r'c:\Users\ragul\.gemini\antigravity\scratch\RNIKASH'

replacements = [
    ('917092300252', '917867955841'),
    ('7092300252', '7867955841'),
    ('70923 00252', '78679 55841'),
    ('70923', '78679'),
]

updated_files = []
for dirpath, dirs, files in os.walk(root):
    # Skip build and dependency directories
    if '.next' in dirpath or 'node_modules' in dirpath:
        continue
        
    for f in files:
        if not f.endswith(('.tsx', '.ts', '.css', '.json', '.js', '.mjs')):
            continue
        filepath = os.path.join(dirpath, f)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='replace') as fh:
                content = fh.read()
        except Exception:
            continue
        
        original = content
        for old, new in replacements:
            content = content.replace(old, new)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as fh:
                fh.write(content)
            updated_files.append(filepath)
            print(f'Updated: {f}')

print(f'\nTotal files updated: {len(updated_files)}')
