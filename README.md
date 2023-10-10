# weaponize.it

[Weaponize.it](https://weaponize.it/) is your go-to resource for gaining insights into ethical hacking, pentesting, bug bounty hunting, and scripting. Explore a curated collection of powerful and practical tips and tricks related to cybersecurity, programming, and system exploitation.

The website was designed to provide you a collection of guides, one-liners, and code snippets to make your life as a hacker easier. Quickly search for keywords and find what suits you best.

All code snippets and techniques were found on the internet or submitted by the community. When contributing, please keep the credits of the original author whenever it's possible.

# Run locally:

```
git clone https://github.com/Nickguitar/weaponize.it
cd weaponize.it
docker build -t weaponize.it .
docker run -d -p 80:8000 --name weaponize.it -v src/:/usr/share/nginx/html/ weaponize.it
```

Website will be available at 127.0.0.1:8000.

# TODO:
- [x] Add tags functionality
- [x] Add "about" section
- [ ] Add functionality to "tags" menu item
- [ ] Make weaponize.it CLI-friendly
- [ ] Figure out a way to receive contributions
- [ ] Add an "author" section for each post