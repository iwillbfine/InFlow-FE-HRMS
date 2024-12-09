<template>
  <div class="wrapper">
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
    <div><span class="dot"></span></div>
  </div>
</template>

<style scoped>
.wrapper {
  height: 100%;
  width: 100%;
  background-color: #00284d;
  position: absolute;
  z-index: -1;
}

.wrapper div {
  height: 40px;
  width: 40px;
  position: absolute;
  top: 10%;
  left: 10%;
  animation: 4s linear infinite;
}

.dot {
  height: 100%;
  width: 100%;
  border-radius: 50px;
  background: rgba(28, 61, 92, 0.8);
  position: absolute;
  top: 20%;
  right: 20%;
  filter: blur(5px);
}

.wrapper div:nth-child(1) {
  top: 20%;
  left: 20%;
  animation: animate 8s linear infinite;
}

.wrapper div:nth-child(2) {
  top: 60%;
  left: 80%;
  animation: animate 10s linear infinite;
}

.wrapper div:nth-child(3) {
  top: 40%;
  left: 40%;
  animation: animate 3s linear infinite;
}

.wrapper div:nth-child(4) {
  top: 66%;
  left: 30%;
  animation: animate 7s linear infinite;
}

.wrapper div:nth-child(5) {
  top: 90%;
  left: 10%;
  animation: animate 9s linear infinite;
}

.wrapper div:nth-child(6) {
  top: 30%;
  left: 60%;
  animation: animate 5s linear infinite;
}

.wrapper div:nth-child(7) {
  top: 70%;
  left: 20%;
  animation: animate 8s linear infinite;
}

.wrapper div:nth-child(8) {
  top: 75%;
  left: 60%;
  animation: animate 10s linear infinite;
}

.wrapper div:nth-child(9) {
  top: 50%;
  left: 50%;
  animation: animate 6s linear infinite;
}

.wrapper div:nth-child(10) {
  top: 45%;
  left: 20%;
  animation: animate 10s linear infinite;
}

.wrapper div:nth-child(11) {
  top: 10%;
  left: 90%;
  animation: animate 9s linear infinite;
}

.wrapper div:nth-child(12) {
  top: 20%;
  left: 70%;
  animation: animate 7s linear infinite;
}

.wrapper div:nth-child(13) {
  top: 20%;
  left: 20%;
  animation: animate 8s linear infinite;
}

.wrapper div:nth-child(14) {
  top: 60%;
  left: 5%;
  animation: animate 6s linear infinite;
}

.wrapper div:nth-child(15) {
  top: 90%;
  left: 80%;
  animation: animate 9s linear infinite;
}

@keyframes animate {
  0% {
    transform: scale(0) translateY(0);
  }
  100% {
    transform: scale(1.3) translateY(-100px);
  }
}
</style>
