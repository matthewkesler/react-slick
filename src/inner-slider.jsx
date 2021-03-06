'use strict';

import React from 'react';
import EventHandlersMixin from './mixins/event-handlers';
import HelpersMixin from './mixins/helpers';
import initialState from './initial-state';
import defaultProps from './default-props';
import classnames from 'classnames';

import {Track} from './track';
import {Dots} from './dots';
import {PrevArrow, NextArrow} from './arrows';

export var InnerSlider = React.createClass({
  mixins: [HelpersMixin, EventHandlersMixin],
  getInitialState: function () {
    return initialState;
  },
  getDefaultProps: function () {
    return defaultProps;
  },
  componentWillMount: function componentWillMount() {
    if (this.props.init) {
      this.props.init();
    }
    this.setState({
      mounted: true
    });
    var lazyLoadedList = [];

    // forward
    for (var i = 0; i < this.props.children.length; i++) {
      if (i >= this.props.initialSlide && i < this.props.initialSlide + this.props.slidesToShow) {
        lazyLoadedList.push(i);
        if(this.props.peek) {
        		lazyLoadedList.push(i+1);
        }
      }
    }

    // backward
    var previous = this.props.initialSlide === 0 ? this.props.children.length - 1 : this.props.initialSlide - 1;
    lazyLoadedList.push(previous);

    if (this.props.lazyLoad && this.state.lazyLoadedList.length === 0) {
      this.setState({
        lazyLoadedList: lazyLoadedList
      });
    }
  },
  componentDidMount: function () {
    // Hack for autoplay -- Inspect Later
    this.initialize(this.props);
    this.adaptHeight();
    window.addEventListener('resize', this.onWindowResized);
  },
  componentWillUnmount: function () {
    window.removeEventListener('resize', this.onWindowResized);
    if (this.state.autoPlayTimer) {
      window.clearTimeout(this.state.autoPlayTimer);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.update(nextProps);
  },
  componentDidUpdate: function () {
    this.adaptHeight();
  },
  onWindowResized: function () {
    this.update(this.props, true);
  },
  render: function () {
    var className = classnames('slick-initialized', 'slick-slider', this.props.className);

    var trackProps = {
      fade: this.props.fade,
      cssEase: this.props.cssEase,
      speed: this.props.speed,
      infinite: this.props.infinite,
      centerMode: this.props.centerMode,
      currentSlide: this.state.currentSlide,
      lazyLoad: this.props.lazyLoad,
      lazyLoadedList: this.state.lazyLoadedList,
      rtl: this.props.rtl,
      slideWidth: this.state.slideWidth,
      slidesToShow: this.props.slidesToShow,
      slideCount: this.state.slideCount,
      trackStyle: this.state.trackStyle,
      variableWidth: this.props.variableWidth
    };

    var dots;

    if (this.props.dots === true && this.state.slideCount > this.props.slidesToShow) {
      var dotProps = {
        dotsClass: this.props.dotsClass,
        slideCount: this.state.slideCount,
        slidesToShow: this.props.slidesToShow,
        currentSlide: this.state.currentSlide,
        slidesToScroll: this.props.slidesToScroll,
        clickHandler: this.changeSlide
      };

      dots = (<Dots {...dotProps} />);
    }

    var prevArrow, nextArrow;

    var arrowProps = {
      infinite: this.props.infinite,
      centerMode: this.props.centerMode,
      currentSlide: this.state.currentSlide,
      slideCount: this.state.slideCount,
      slidesToShow: this.props.slidesToShow,
      prevArrow: this.props.prevArrow,
      nextArrow: this.props.nextArrow,
      clickHandler: this.changeSlide
    };

    if (this.props.arrows) {
      prevArrow = (<PrevArrow {...arrowProps} />);
      nextArrow = (<NextArrow {...arrowProps} />);
    }

    return (
      <div className={className}>
        <div
          ref='list'
          className="slick-list"
          onMouseDown={this.swipeStart}
          onMouseMove={this.state.dragging ? this.swipeMove: null}
          onMouseUp={this.swipeEnd}
          onMouseLeave={this.state.dragging ? this.swipeEnd: null}
          onTouchStart={this.swipeStart}
          onTouchMove={this.state.dragging ? this.swipeMove: null}
          onTouchEnd={this.swipeEnd}
          onTouchCancel={this.state.dragging ? this.swipeEnd: null}>
          <Track ref='track' {...trackProps}>
            {this.props.children}
          </Track>
        </div>
        {prevArrow}
        {nextArrow}
        {dots}
      </div>
    );
  }
});
