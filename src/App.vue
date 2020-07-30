<template>
  <div id="app">
    <a href="https://www.metrici.ro/" target="_blank" class="mini-logo"></a>
    <Navbar></Navbar>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <Footer></Footer>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/js/all.js'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default {
  name: "App",
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

html {
  height: 100%;
}

body {
  width: 100vw;
  max-width: 100%;
  position: relative;
  min-height: 100%;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #1d1f23;
  color: rgba(255, 255, 255, 0.85);
  font-family: "Montserrat", sans-serif;
}

#app {
  width: 100vw;
  max-width: 100%;
  min-height: 100%;
  min-height: 100vh;
  z-index: -100;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar {
  width: 8px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #464b54;
}

a,
a:hover,
a:visited,
a:focus,
a:active {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #96ede5;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #96ede5;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: #96ede5;
}

a.router-link-active {
  color: rgba(225, 20, 34, 1);
  text-shadow: 2px 0px 8px rgba(0, 0, 0, 0.4), -2px 0px 8px rgba(0, 0, 0, 0.4),
    0px 3px 8px rgba(0, 0, 0, 0.4);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
}

/* START - Section */
section {
  min-width: 675px;
  max-width: 1000px;
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 75px;
  height: auto;
  padding: 1em;
  border-radius: 8px;
}

section h1 {
  text-align: left;
  padding: 0.5em;
}


.title span {
  color: #96ede5;
}

/* START - Top Container */
.top_container,
.bottom_container {
  position: relative;
  width: 100%;
  height: auto;
  margin: 1em;
  color: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
}

.top_container {
  height: 300px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 1em;
}

.left_container,
.right_container {
  width: 48%;
  height: 100%;
  background-color: #26282d;
  border-radius: 8px;
}

.mid_container {
  width: 100%;
  height: 100%;
  background-color: #26282d;
  border-radius: 8px;
}

.inner_container {
  height: calc(100% - 53px);
  padding: 0 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.inner_container span {
  color: #96ede5;
  word-wrap: break-word;
}

.inner_container form {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.input_row {
  width: 100%;
  height: 60px;
  bottom: 0;
  position: relative;
}

.input_text {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 3px;
  outline: none;
  padding-left: 10px;
  color: rgba(255, 255, 255, 0.85);
  z-index: 3;
  font-family: "Montserrat", sans-serif;
  font-size: 1em;
}

.input_text:focus {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
  background-color: rgba(0, 0, 0, 0.4);
}

.label_ {
  position: absolute;
  opacity: 0;
  transition: 0.2s bottom, 0.2s opacity;
  bottom: 0;
  z-index: 1;
  font-size: 1em;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.85);
}

.input_text:focus + .label_ {
  bottom: 60%;
  line-height: 1;
  opacity: 1;
  margin-left: 10px;
}

.button {
  width: 45%;
  min-width: 170px;
  height: 30px;
  position: relative;
  border: none;
  outline: none;
  border-radius: 8px;
  background-color: rgba(225, 20, 34, 0.5);
  color: rgba(255, 255, 255, 0.85);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  margin: 1em 0;
  padding: 5px;
  font-size: 1em;
  font-weight: bold;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  /* align-self: center; */
}

.button:hover {
  background-color: rgba(225, 20, 34, 0.8);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.7);
}

/* END - Top Container */

/* START - Bottom Container */

.bottom_container {
  background-color: #26282d;
  width: 100%;
}

.log_container {
  padding: 0.5em;
  letter-spacing: 0.5px;
  font-size: 1.1em;
}
/* END - Bottom Container */
</style>
