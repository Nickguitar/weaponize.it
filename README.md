# weaponize.it
[Weaponize.it](https://weaponize.it/) is your go-to resource for gaining insights into ethical hacking, pentesting, bug bounty hunting, and scripting. Explore a curated collection of powerful and practical tips and tricks related to cybersecurity, programming, and system exploitation.

The website was designed to provide you a collection of guides, one-liners, cheatsheets and code snippets to make your life as a hacker easier. Quickly search for keywords and find what suits you best.

All code snippets and techniques were found on the internet or submitted by the community. When contributing, please keep the credits of the original author whenever it's possible.

# Why
Quite often, in the midst of my pentests or during CTFs, I find myself in the search for a script I used ages ago, or I end up scrolling through numerous commands in the terminal history, attempting to recall what I need, or navigating through a cluster of 10 cheatsheets just to find that one specific command.

Using Weaponize.it, I can simply input keywords relevant to my desired information into the search bar, and instantaneously search through community-contributed data.

# How to contribute
To contribute to Weaponize.it, fork the repository, create your entries as .toml files in the [entries](/entries) folder, and submit a pull request. Once accepted, your contributions will be accessible to everyone on [Weaponize.it](https://weaponize.it/).

## The toml files
Each toml file in the entries folder corresponds to an entry on Weaponize.it. The toml files have the following structure:
```toml
title = "Title of the entry"
description = "Brief description of the entry"
tags = ["tag1", "tag2"]
source = "https://example.com/source.html"

[[data]]
description = "Description about the command below"
language = "bash"
command = """echo 'the command itself'"""
```

### Guidelines for submissions
1. Ensure that the fields `title`, `tags`, and `command` are filled out, as they are mandatory.
2. While optional, you can include additional information in the `description`, `source` and `language` fields.
3. When adding a source, make sure the field `source` is composed of valid URLs.
4. Keep the `title` and `description` and the toml filename concise for clarity and brevity.
5. The toml filename should have underscores (_) as spaces.
6. Consider existing `tags` when selecting appropriate tags for your submission.
7. Utilize multiple `[[data]]` fields if you have more than one command to share.
8. The `language` field should either be left empty or contain a language supported by [highlight.js](https://highlightjs.org/download).
9. The `command` field is capable of multiline entries for comprehensive detailing.
10. Characters in the `command` field do not require escaping.
11. The contents of the submitted file can be modified before being approved.
12. Check the already existing [entries](/entries) and use them as template if needed.

# Run Weaponize.it locally
```
git clone https://github.com/Nickguitar/weaponize.it
cd weaponize.it
docker build -t weaponize.it .
docker run -d -p 80:8000 --name weaponize.it -v src:/usr/share/nginx/html/ weaponize.it
```

Website will be available at 127.0.0.1:8000.

# This project is still under development
## TODO:
- [x] Add tags functionality
- [x] Add "about" section
- [ ] Add functionality to "tags" menu item
- [ ] ~~Make weaponize.it CLI-friendly~~
- [x] Figure out a way to receive contributions
- [x] Add a "source" section for each post
- [x] Add a copy button for the code snippets
- [ ] Find a lighter syntax highlighting script
- [ ] Migrate completely to aws s3 (go serverless)
- [x] Automatize pull and commit of generated json
- [x] Fix the timestamps of uploaded toml files
- [ ] Find a way to track tags better
- [ ] Make a "preview post" for .toml files