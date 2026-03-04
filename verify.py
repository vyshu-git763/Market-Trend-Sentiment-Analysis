import sys
print("="*60)
print("PYTHON ENVIRONMENT VERIFICATION")
print("="*60)

print(f"Python: {sys.version[:6]}")
print(f"Path: {sys.executable}")
print()

# Test critical packages
packages = [
    ('pandas', 'pd'),
    ('numpy', 'np'),
    ('torch', 'torch'),
    ('transformers', 'transformers'),
    ('sklearn', 'sklearn'),
    ('matplotlib', 'plt')
]

for package, alias in packages:
    try:
        exec(f"import {package} as {alias}")
        version = eval(f"{alias}.__version__")
        print(f"✅ {package:20} {version}")
    except ImportError:
        print(f"❌ {package:20} NOT INSTALLED")
    except AttributeError:
        print(f"⚠️  {package:20} installed (no version info)")

print("\n" + "="*60)
print("Run your project with: py -3.11 main.py")
print("="*60)