document.addEventListener('DOMContentLoaded', function () {
  const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
  const interval = 5000;
  let index = 0;
  let intervalID;

  const heroElement = document.getElementById('hero');
  const leftArrow = document.getElementById('behindImage');
  const rightArrow = document.getElementById('frontImage');

  function changeImage() {
    heroElement.src = `/hero/${images[index]}`;
  }

  function moveForward() {
    index = (index + 1) % images.length;
    changeImage();
  }

  function moveBackward() {
    index = (index - 1 + images.length) % images.length;
    changeImage();
  }

  function resetInterval() {
    clearInterval(intervalID);
    intervalID = setInterval(moveForward, interval);
  }

  changeImage();
  intervalID = setInterval(moveForward, interval);

  leftArrow.addEventListener('click', function () {
    moveBackward();
    resetInterval();
  });

  rightArrow.addEventListener('click', function () {
    moveForward();
    resetInterval();
  });
});
