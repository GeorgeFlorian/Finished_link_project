<template>
  <nav>
    <div class="nav_container">
      <a href="https://github.com/GeorgeFlorian" target="_blank" class="logo"></a>
      <ul>
        <li>
          <router-link to="/home">Home</router-link>
        </li>
        <li class="dropdown">
          <a class="touch">
            Network Settings
            <i class="fas fa-angle-down"></i>
            <i class="fas fa-angle-up"></i>
          </a>
          <div class="dropdown-content">
            <router-link to="/dhcpIP">DHCP IP</router-link>
            <router-link to="/staticIP">Static IP</router-link>
          </div>
        </li>
        <li>
          <router-link to="/files">File Manager</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar"
};
</script>

<style scoped>

/* START - Navigation Bar */
.mini-logo,
.fa-angle-up {
  display: none;
}

nav {
  width: 100vw;
  max-width: 100%;
  position: relative;
  transition: font-size 0.25s ease, top 0.5s ease;
  background-color: #2f3238;
  z-index: 1000;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

nav .nav_container {
  width: 90%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 60px;
}

.nav_container .logo {
  display: block;
  width: 250px;
  height: 100%;
  background-image: url("../assets/images/logo.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

nav ul {
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  list-style-type: none;
  transition: all 0.25s linear;
  height: 100%;
}

nav ul li {
  white-space: nowrap;
  transition: padding 0.25s ease;
}

nav ul li a {
  padding: 1em 0.7em;
  display: block;
  transition: all 0.25s ease;
  text-shadow: 3px 0px 7px rgba(0, 0, 0, 0.4), -3px 0px 7px rgba(0, 0, 0, 0.4),
    0px 4px 7px rgba(0, 0, 0, 0.4);
  font-weight: bold;
}
nav ul li a:hover {
  color: rgba(225, 20, 34, 1);
  text-shadow: 2px 0px 8px rgba(0, 0, 0, 0.4), -2px 0px 8px rgba(0, 0, 0, 0.4),
    0px 3px 8px rgba(0, 0, 0, 0.4);
}

nav .dropdown {
  position: relative;
}

nav .dropdown-content {
  display: none;
  position: absolute;
  background-color: rgba(47, 50, 56, 1);
  min-width: 140px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  left: 50%;
  transform: translate(-50%, 0);
  top: 100%;
  text-align: center;
}

nav .dropdown-content::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translate(-50%, 0);
  width: 0;
  height: 0;
  border-left: 0.5em solid transparent;
  border-bottom: 0.5em solid #757c8c;
  border-right: 0.5em solid transparent;
}

nav .dropdown-content a:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

nav .dropdown:hover .dropdown-content {
  display: block;
}

/* END - Navigation Bar */
</style>