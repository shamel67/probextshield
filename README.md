# 🛡️ ProbExtShield

**ProbExtShield** is a Chrome extension that detects when websites attempt to probe which browser extensions you have installed.
Inspired by my work on [CleanedIn](https://github.com/shamel67/CleanedIn), this project uses modern, non-intrusive techniques to inform users and collect anonymized analytics.

For example, LinkedIn is probing for the presence of over 1800 extensions!

---

## 🔍 What It Does

- Detects websites trying to fingerprint installed extensions
- Displays a warning badge with the number of unique extensions probed
- Tracks extension probing anonymously using GA4 (opt-in)
- Cache and deduplicates analytics to avoid flooding
- Offers an options page to clear cache and control behavior

---

## 🧩 How Extension Probing Works

Some websites use known extension IDs and try to load resources from `chrome-extension://<id>/` paths. If the resource loads successfully, the website knows the extension is installed. ProbExtShield detects this behavior, alerts the user, and can block those requests to protect the user's privacy.

---

## ⚙️ Installation
Works in Chrome and Brave (recommended).
- on Github, click on the "<> Code" button and "Download ZIP", then unzip in a folder of your choice.
- or do "npm install probextshield" in a folder of your choice.

1. Type chrome://extensions in the Chrome URL bar and press enter.
1. Enable developer mode using the toggle on the right
1. Click Load Unpacked on the left side of the screen.
1. Navigate to the location of the folder you unzipped, and select it.

---

### 🗃️ Caching Behavior

To avoid redundant analytics:
- Events are cached in chrome.storage.local
- Each (hostname|extensionId) entry is stored with a timestamp
- Only the 1000 most recent entries are retained
- Entries expire after 28 days
- The cache is automatically trimmed during usage

---

### ⚙️ Options Page Features

The options UI provides:
- A Clear GA Cache button
- A visual confirmation message (“Cache cleared!”)
- More settings and controls coming soon

---

## 📡 Analytics & Privacy
- Analytics is an opt-in feature controlled in the options dialog
- Events are sent as page_view events to GA4 using Measurement Protocol
- No cookies, IP addresses, or user identifiers are sent
- Events use a spoofed domain structure like: `https://probextshield.ca/{hostname}/{extensionId}`

---

## 🔒 Privacy-First Design
- Zero fingerprinting or user-level tracking
- Local-only caching of detection events
- Deduplication prevents unnecessary reporting
- Fully open-source and inspectable

---

## 🚧 Roadmap
- Retrieve extension names
- Use a proxy for data collection
- Create a public dashboard showing the sites using this technique and which extensions they are probing

---

## 🚫 License &amp; Disclaimer

MIT License. Feel free to fork, contribute, and remix.

---

### Disclaimer

This project is provided **as-is**, without any warranties or guarantees of any kind, express or implied.

The code is shared **for educational and experimental purposes only**. Use it at your own risk.

---

## 🙋 Contributing

Contributions are welcome under strict terms.

By submitting a pull request, you agree that:
- Your code is original
- You grant the project owner a non-exclusive, worldwide, royalty-free license to use and modify your contribution
- Your contributions may be used in the CleanedIn project only

Steps to contribute:
1. Fork the repo
2. Create a feature branch
3. Submit a pull request with a clear explanation

👉 [Sponsor this project, buy me a coffee!](ko-fi.com/shamel)

---

## 📫 Contact

Questions? Licensing inquiries?  
Email: `shamel67@gmail.com`

---

**Made with ❤️ in Canada 🇨🇦.**
