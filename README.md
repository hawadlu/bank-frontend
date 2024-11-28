<h2>Set up</h2>
I have used vite to run the frontend.

```
npi i
npm run dev
```

This needs to be run without cors. You can use this command to do it in chrome.

```
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```