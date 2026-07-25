with open("dashboard.html", "r") as f:
    content = f.read()

old_css = """        .tx-hash {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--accent-cyan);
            text-decoration: none;
            transition: opacity 0.2s;
        }"""

new_css = """        .tx-hash {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--accent-cyan);
            text-decoration: underline;
            cursor: pointer;
            transition: opacity 0.2s;
        }"""

if old_css in content:
    content = content.replace(old_css, new_css)
    with open("dashboard.html", "w") as f:
        f.write(content)
    print("CSS fixed!")
else:
    print("Could not find CSS block")
