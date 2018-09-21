# gig
Create `.gitignore` file from any source such as [Github](https://github.com/github/gitignore/) or your local directory.

# Installation
```
$ npm i -g gig
```

# Usage
## 1. Fetch template
Fetch `tpl` .gitignore template from registered source:
```
$ gig fetch [options] <tpl>
```
Options:

  - `-s, --source [source]`: source name (default: github)
  - `-d, --dest [dest]`: project root (default: .gitignore)
  - `-h, --help`: output usage information

The source must be registered before using. Except the [`github`](https://github.com/github/gitignore/) is always available. See [here](#4-addupdate-source-information) for more info.

E.x: Download the [`Node`](https://github.com/github/gitignore/blob/master/Node.gitignore) template from [`github`](https://github.com/github/gitignore/)
```
$ gig fetch Node
```

## 2. List templates
List all available .gitignore templates from `src` source (default: github):
```
$ gig list [src]
```

E.x: Show all templates from [`github`](https://github.com/github/gitignore/)
```
$ gig list github
```

## 3. List template sources
List all available sources:
```
$ gig src-list
```

## 4. Add/Update source information
Add/Update `key` source info with `list` and `file`:
```
$ gig src-add <key> <list> [file]
```

Where:

- `list`: URL or Directory which contain list of templates. If `list` is a url, it has to return a json file as [Github Contents API](https://developer.github.com/v3/repos/contents/#response-if-content-is-a-directory).
- `file`: The root path contains template file. Default is the value of `list`.

E.x 1: Add template source from `~/gitignore_tpl` folder with name `igig`
```
$ gig src-add igig "~/gitignore_tpl"
```

E.x 2: Add template source from https://github.com/dvcs/gitignore with name `dvcs`
```
$ gig src-add dvcs "https://api.github.com/repos/dvcs/gitignore/contents/templates" "https://raw.githubusercontent.com/dvcs/gitignore/master/templates"
```

## 5. Show source information
Show `key` source info:
```
$ gig src-show <key>
```

E.x: Show `dvcs` source info
```
$ gig src-show dvcs
```

## 6. Remove source information
Remove `key` source from source list:
```
$ gig src-del <key>
```

E.x: Remove `dvcs` source
```
$ gig src-del dvcs
```