import {TweenMax} from 'gsap';

export default class SimpleCarousel {
  constructor(slideNameSpace) {
    this.slideNameSpace = slideNameSpace;
    this.prevButtonElement = document.querySelector(this.slideNameSpace + '__wrapper__arrows__arrow--prev')
    this.nextButtonElement = document.querySelector(this.slideNameSpace + '__wrapper__arrows__arrow--next')
    this.targetSlidesElement = document.querySelector(this.slideNameSpace + '__wrapper__slides__inner')
    this.targetDotsElement = document.querySelector(this.slideNameSpace + '__wrapper__dots')
    this.allSlideIndex = document.querySelector(this.slideNameSpace + '__wrapper__slides__inner > ul').childElementCount;

    this.currentSlideIndex = 0;
    this.isMoved = false;
    this.dotsButtons = null;

    this.initialize()
  }

  initialize() {
    this.insertDots()
    this.setSlidesSize()
    this.onResizeSlides()

    this.prevButtonElement.addEventListener('click', () => {
      this.gotoSlide(this.currentSlideIndex - 1);
    })
    this.nextButtonElement.addEventListener('click', () => {
      this.gotoSlide(this.currentSlideIndex + 1);
    })
    this.updateState()
  }


  onResizeSlides() {
    window.addEventListener('resize', () => {
      if (timer > 0) {
        clearTimeout(timer);
      }
      const timer = setTimeout(() => {
        this.setSlidesSize()
      }, 200);
    })
  }

  setSlidesSize() {
    const slides = document.querySelectorAll(this.slideNameSpace + '__wrapper__slides__inner > ul > li')
    const wrapContentWidth = this.targetSlidesElement.clientWidth;
    const wrapContentHeight = this.targetSlidesElement.clientHeight;

    slides.forEach(slide => {
      slide.style.width = wrapContentWidth + 'px';
      slide.style.height - wrapContentHeight + 'px';
    })

    document.querySelector(this.slideNameSpace + '__wrapper__slides__inner > ul').style.width = (wrapContentWidth * this.allSlideIndex) + 'px'
  }

  gotoSlide(targetIndex) {
    // 連打禁止
    if (!this.isMoved) {
      const nextSlideIndex = targetIndex % this.allSlideIndex;
      const toX = -100 * nextSlideIndex;
      this.updateState();
      this.isMoved = true;

      TweenMax.to(this.targetSlidesElement, 0.4, {
        x: toX + '%',
        onComplete: () => {
          this.isMoved = false;
          this.updateState();
        }
      })

      this.currentSlideIndex = nextSlideIndex;
    }
  }

  updateState() {
    this.prevButtonElement.classList.remove('is-disable')
    this.nextButtonElement.classList.remove('is-disable')

    for (let i = 0; i < this.dotsButtons.length; i++) {
      const dotElement = this.dotsButtons[i];
      if (i == this.currentSlideIndex) {
        dotElement.classList.add('is-active');
      } else {
        dotElement.classList.remove('is-active');
      }
    }

    if (this.currentSlideIndex == 0) {
      this.prevButtonElement.classList.add('is-disable')
    } else if (this.currentSlideIndex >= (this.allSlideIndex - 1)) {
      this.nextButtonElement.classList.add('is-disable')
    }
  }

  insertDots() {
    for (let i = 0; i < this.allSlideIndex; i++) {
      const labelNumber = (i !== 0) ? (i + 1) : 1;
      const newDot = document.createElement('button');
      const dotlabel = document.createTextNode(labelNumber);

      newDot.appendChild(dotlabel)
      newDot.setAttribute('data-index', i);
      newDot.addEventListener('click', () => this.onClickDots(newDot))

      this.targetDotsElement.appendChild(newDot)
    }

    this.dotsButtons = document.querySelectorAll(this.slideNameSpace + '__wrapper__dots > button');
  }

  onClickDots(newDot) {
    const targetNum = newDot.getAttribute('data-index')
    this.gotoSlide(targetNum)
  }
}