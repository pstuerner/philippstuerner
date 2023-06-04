<template>
  <nav class="navbar navbar-expand-lg navbar-light" id="mainNav">
    <div class="container px-4 px-lg-5">
      <router-link to="/"><a class="navbar-brand"><span class="cursor">$ cd /home/</span></a></router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        Menu
        <i class="fas fa-bars"></i>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto py-4 py-lg-0">
          <li class="nav-item">
            <router-link class="nav-link px-lg-3 py-3 py-lg-4" to="/about">About</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>