<template>
  <footer>
    <span class="version">
      <a
        href="#"
        title="Go to Display documentation"
      >Display Controller</a>
      - Version: 1.5
    </span>
    <span class="copyright">
      <a href="https://github.com/GeorgeFlorian" target="_blank" title="Go to Metrici Website">SGF</a>
      © 2020 - All Rights Reserved.
    </span>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
/* START - Footer */
footer {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;
  letter-spacing: 1px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.version a {
  font-size: 1.1em;
  font-weight: bold;
}

.version a,
.version a:hover,
.version a:visited,
.version a:focus,
.version a:active {
  color: #96ede5;
}

.copyright a {
  font-size: 1.2em;
  font-weight: bold;
}

.copyright a,
.copyright a:hover,
.copyright a:visited,
.copyright a:focus,
.copyright a:active {
  color: #ea5a64;
}

/* END - Footer */
</style>