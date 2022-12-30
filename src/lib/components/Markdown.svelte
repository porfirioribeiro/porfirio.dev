<script lang="ts">
  export let body: string;
</script>

<div>
  {@html body}
</div>

<style lang="scss">
  div :global {
    //// twitter
    .twitter-tweet:not(.twitter-tweet-rendered) {
      max-width: 550px;
      margin: 0;
      border: 1px solid rgb(66, 83, 100);
      border-radius: 12px;
      background-color: rgb(21, 32, 43);
      > a {
        color: white;
        display: block;
        padding: 16px;
      }
    }
    .twitter-tweet + .twitter-tweet {
      margin-top: -10px;
    }

    //// github markdown css
    // TODO: check if we need all this css
    font-size: 16px;
    word-wrap: break-word;

    --color-fg-default: #c9d1d9;
    --color-fg-muted: #8b949e;
    --color-canvas-default: #0d1117;
    --color-canvas-subtle: #161b22;
    --color-border-default: #30363d;
    --color-border-muted: #21262d;
    --color-neutral-muted: rgba(110, 118, 129, 0.4);

    & > *:first-child {
      margin-top: 0 !important;
    }
    & > *:last-child {
      margin-bottom: 0 !important;
    }
    & a:not([href]) {
      color: inherit;
      text-decoration: none;
    }
    & .absent {
      color: var(--color-danger-fg);
    }
    & .anchor {
      float: left;
      padding-right: 4px;
      margin-left: -20px;
      line-height: 1;
    }
    & .anchor:focus {
      outline: none;
    }
    & p,
    & blockquote,
    & ul,
    & ol,
    & dl,
    & table,
    & pre,
    & details {
      margin-top: 0;
      margin-bottom: 16px;
    }
    & hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: var(--color-border-default);
      border: 0;
    }
    & blockquote {
      padding: 0 1em;
      color: var(--color-fg-muted);
      border-left: 0.25em solid var(--color-border-default);
    }
    & blockquote > :first-child {
      margin-top: 0;
    }
    & blockquote > :last-child {
      margin-bottom: 0;
    }
    & h1,
    & h2,
    & h3,
    & h4,
    & h5,
    & h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: var(--base-text-weight-semibold, 600);
      line-height: 1.25;
    }
    & h1 .octicon-link,
    & h2 .octicon-link,
    & h3 .octicon-link,
    & h4 .octicon-link,
    & h5 .octicon-link,
    & h6 .octicon-link {
      color: var(--color-fg-default);
      vertical-align: middle;
      visibility: hidden;
    }
    & h1:hover .anchor,
    & h2:hover .anchor,
    & h3:hover .anchor,
    & h4:hover .anchor,
    & h5:hover .anchor,
    & h6:hover .anchor {
      text-decoration: none;
    }
    & h1:hover .anchor .octicon-link,
    & h2:hover .anchor .octicon-link,
    & h3:hover .anchor .octicon-link,
    & h4:hover .anchor .octicon-link,
    & h5:hover .anchor .octicon-link,
    & h6:hover .anchor .octicon-link {
      visibility: visible;
    }
    & h1 tt,
    & h1 code,
    & h2 tt,
    & h2 code,
    & h3 tt,
    & h3 code,
    & h4 tt,
    & h4 code,
    & h5 tt,
    & h5 code,
    & h6 tt,
    & h6 code {
      padding: 0 0.2em;
      font-size: inherit;
    }
    & h1 {
      padding-bottom: 0.3em;
      font-size: 2em;
      border-bottom: 1px solid var(--color-border-muted);
    }
    & h2 {
      padding-bottom: 0.3em;
      font-size: 1.5em;
      border-bottom: 1px solid var(--color-border-muted);
    }
    & h3 {
      font-size: 1.25em;
    }
    & h4 {
      font-size: 1em;
    }
    & h5 {
      font-size: 0.875em;
    }
    & h6 {
      font-size: 0.85em;
      color: var(--color-fg-muted);
    }
    & summary h1,
    & summary h2,
    & summary h3,
    & summary h4,
    & summary h5,
    & summary h6 {
      display: inline-block;
    }
    & summary h1 .anchor,
    & summary h2 .anchor,
    & summary h3 .anchor,
    & summary h4 .anchor,
    & summary h5 .anchor,
    & summary h6 .anchor {
      margin-left: -40px;
    }
    & summary h1,
    & summary h2 {
      padding-bottom: 0;
      border-bottom: 0;
    }
    & ul,
    & ol {
      padding-left: 2em;
    }
    & ul.no-list,
    & ol.no-list {
      padding: 0;
      list-style-type: none;
    }
    & ol[type="a"] {
      list-style-type: lower-alpha;
    }
    & ol[type="A"] {
      list-style-type: upper-alpha;
    }
    & ol[type="i"] {
      list-style-type: lower-roman;
    }
    & ol[type="I"] {
      list-style-type: upper-roman;
    }
    & ol[type="1"] {
      list-style-type: decimal;
    }
    & div > ol:not([type]) {
      list-style-type: decimal;
    }
    & ul ul,
    & ul ol,
    & ol ol,
    & ol ul {
      margin-top: 0;
      margin-bottom: 0;
    }
    & li > p {
      margin-top: 16px;
    }
    & li + li {
      margin-top: 0.25em;
    }
    & dl {
      padding: 0;
    }
    & dl dt {
      padding: 0;
      margin-top: 16px;
      font-size: 1em;
      font-style: italic;
      font-weight: var(--base-text-weight-semibold, 600);
    }
    & dl dd {
      padding: 0 16px;
      margin-bottom: 16px;
    }
    & table {
      border-spacing: 0;
      border-collapse: collapse;
      display: block;
      width: 100%;
      width: max-content;
      max-width: 100%;
      overflow: auto;
    }
    & table th {
      font-weight: var(--base-text-weight-semibold, 600);
    }
    & table th,
    & table td {
      padding: 6px 13px;
      border: 1px solid var(--color-border-default);
    }
    & table tr {
      background-color: var(--color-canvas-default);
      border-top: 1px solid var(--color-border-muted);
    }
    & table tr:nth-child(2n) {
      background-color: var(--color-canvas-subtle);
    }
    & table img {
      background-color: transparent;
    }
    & img {
      max-width: 100%;
      box-sizing: content-box;
      background-color: var(--color-canvas-default);
    }
    & img[align="right"] {
      padding-left: 20px;
    }
    & img[align="left"] {
      padding-right: 20px;
    }
    & .emoji {
      max-width: none;
      vertical-align: text-top;
      background-color: transparent;
    }
    & span.frame {
      display: block;
      overflow: hidden;
    }
    & span.frame > span {
      display: block;
      float: left;
      width: auto;
      padding: 7px;
      margin: 13px 0 0;
      overflow: hidden;
      border: 1px solid var(--color-border-default);
    }
    & span.frame span img {
      display: block;
      float: left;
    }
    & span.frame span span {
      display: block;
      padding: 5px 0 0;
      clear: both;
      color: var(--color-fg-default);
    }
    & span.align-center {
      display: block;
      overflow: hidden;
      clear: both;
    }
    & span.align-center > span {
      display: block;
      margin: 13px auto 0;
      overflow: hidden;
      text-align: center;
    }
    & span.align-center span img {
      margin: 0 auto;
      text-align: center;
    }
    & span.align-right {
      display: block;
      overflow: hidden;
      clear: both;
    }
    & span.align-right > span {
      display: block;
      margin: 13px 0 0;
      overflow: hidden;
      text-align: right;
    }
    & span.align-right span img {
      margin: 0;
      text-align: right;
    }
    & span.float-left {
      display: block;
      float: left;
      margin-right: 13px;
      overflow: hidden;
    }
    & span.float-left span {
      margin: 13px 0 0;
    }
    & span.float-right {
      display: block;
      float: right;
      margin-left: 13px;
      overflow: hidden;
    }
    & span.float-right > span {
      display: block;
      margin: 13px auto 0;
      overflow: hidden;
      text-align: right;
    }
    & code,
    & tt {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      white-space: break-spaces;
      background-color: var(--color-neutral-muted);
      border-radius: 6px;
    }
    & code br,
    & tt br {
      display: none;
    }
    & del code {
      text-decoration: inherit;
    }
    & samp {
      font-size: 85%;
    }
    & pre {
      word-wrap: normal;
    }
    & pre code {
      font-size: 100%;
    }
    & pre > code {
      padding: 0;
      margin: 0;
      word-break: normal;
      white-space: pre;
      background: transparent;
      border: 0;
    }
    & .highlight {
      margin-bottom: 16px;
    }
    & .highlight pre {
      margin-bottom: 0;
      word-break: normal;
    }
    & .highlight pre,
    & pre {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: var(--color-canvas-subtle);
      border-radius: 6px;
    }
    & pre code,
    & pre tt {
      display: inline;
      max-width: auto;
      padding: 0;
      margin: 0;
      overflow: visible;
      line-height: inherit;
      word-wrap: normal;
      background-color: transparent;
      border: 0;
    }
    & .csv-data td,
    & .csv-data th {
      padding: 5px;
      overflow: hidden;
      font-size: 12px;
      line-height: 1;
      text-align: left;
      white-space: nowrap;
    }
    & .csv-data .blob-num {
      padding: 10px 8px 9px;
      text-align: right;
      background: var(--color-canvas-default);
      border: 0;
    }
    & .csv-data tr {
      border-top: 0;
    }
    & .csv-data th {
      font-weight: var(--base-text-weight-semibold, 600);
      background: var(--color-canvas-subtle);
      border-top: 0;
    }
    & [data-footnote-ref]::before {
      content: "[";
    }
    & [data-footnote-ref]::after {
      content: "]";
    }
    & .footnotes {
      font-size: 12px;
      color: var(--color-fg-muted);
      border-top: 1px solid var(--color-border-default);
    }
    & .footnotes ol {
      padding-left: 16px;
    }
    & .footnotes ol ul {
      display: inline-block;
      padding-left: 16px;
      margin-top: 16px;
    }
    & .footnotes li {
      position: relative;
    }
    & .footnotes li:target::before {
      position: absolute;
      top: -8px;
      right: -8px;
      bottom: -8px;
      left: -24px;
      pointer-events: none;
      content: "";
      border: 2px solid var(--color-accent-emphasis);
      border-radius: 6px;
    }
    & .footnotes li:target {
      color: var(--color-fg-default);
    }
    & .footnotes .data-footnote-backref g-emoji {
      font-family: monospace;
    }
  }
</style>
