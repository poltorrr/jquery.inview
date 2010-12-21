module('jquery.inview', {
  setup: function() {
    $(window).scrollTop(0).scrollLeft(0);
    
    this.size = 20000;
    this.container = $('<div>', {
      className: 'test-container'
    }).appendTo("body");
    this.element = $('<div>', {
      html: 'testing ...',
      className: 'test-element'
    }).css({
      background: '#eee',
      width:      '50px',
      height:     '50px',
      position:   'absolute'
    });
  },

  teardown: function() {
    $(window).scrollTop(0).scrollLeft(0);
    
    this.container.remove();
    this.element.remove();
  }
});


test('Check vertical scrolling', function() {
  expect(5);
  stop(10000);

  var element = this.element,
      firstCall,
      secondCall,
      thirdCall,
      inView;

  element.css({ left: 0, top: this.size - 50 + 'px' });
  element.appendTo('body');
  element.bind('inview.firstCall', function() { firstCall = true; });

  setTimeout(function() {
    $(window).scrollTop(0).scrollLeft(0);

    ok(!firstCall, 'inview shouldn\'t be triggered initially when the element isn\'t in the viewport');
    element.unbind('inview.firstCall');
    element.bind('inview.secondCall', function(event, inViewParam) {
      secondCall = true;
      inView = inViewParam;
    });

    $(window).scrollTop(9999999);

    setTimeout(function() {

      ok(secondCall, 'Triggered handler after element appeared in viewport');
      ok(inView, 'Parameter, indicating whether the element is in the viewport, is set to "true"');
      element.unbind('inview.secondCall');
      element.bind('inview.thirdCall', function(event, inViewParam) {
        thirdCall = true;
        inView = inViewParam;
      });

      $(window).scrollTop(0).scrollLeft(0);

      setTimeout(function() {
        ok(thirdCall, 'Triggered handler after element disappeared in viewport');
        strictEqual(inView, false, 'Parameter, indicating whether the element is in the viewport, is set to "false"');
        start();
      }, 1000);

    }, 1000);

  }, 1000);
});


test('Check horizontal scrolling', function() {
  expect(5);
  stop(10000);

  var element = this.element,
      firstCall,
      secondCall,
      thirdCall,
      inView;

  element.css({ top: 0, left: this.size - 50 + 'px' });
  element.appendTo('body');
  element.bind('inview.firstCall', function() { firstCall = true; });

  setTimeout(function() {
    $(window).scrollTop(0).scrollLeft(0);

    ok(!firstCall, 'inview shouldn\'t be triggered initially when the element isn\'t in the viewport');
    element.unbind('inview.firstCall');
    element.bind('inview.secondCall', function(event, inViewParam) {
      secondCall = true;
      inView = inViewParam;
    });

    $(window).scrollLeft(9999999);

    setTimeout(function() {

      ok(secondCall, 'Triggered handler after element appeared in viewport');
      ok(inView, 'Parameter, indicating whether the element is in the viewport, is set to "true"');
      element.unbind('inview.secondCall');
      element.bind('inview.thirdCall', function(event, inViewParam) {
        thirdCall = true;
        inView = inViewParam;
      });

      $(window).scrollTop(0).scrollLeft(0);

      setTimeout(function() {
        ok(thirdCall, 'Triggered handler after element disappeared in viewport');
        strictEqual(inView, false, 'Parameter, indicating whether the element is in the viewport, is set to "false"');
        start();
      }, 1000);

    }, 1000);

  }, 1000);
});


test('Move element into viewport without scrolling', function() {
  expect(3);
  stop(10000);

  var element = this.element, calls = 0;

  element
    .css({ left: '-500px', top: 0 })
    .appendTo('body')
    .bind('inview', function(event) { calls++; });

  setTimeout(function() {

    equals(calls, 0, 'Callback hasn\'t been fired since the element isn\'t in the viewport');
    element.css({ left: 0 });

    setTimeout(function() {

      equals(calls, 1, 'Callback has been fired after the element appeared in the viewport');
      element.css({ left: '10000px' });

      setTimeout(function() {

        equals(calls, 2, 'Callback has been fired after the element disappeared from viewport');
        start();

      }, 1000);

    }, 1000);

  }, 1000);
});


test('Check whether element which isn\'t in the dom tree triggers the callback', function() {
  expect(0);
  stop(2000);

  this.element.bind('inview', function(event, isInView) {
    ok(false, 'Callback shouldn\'t be fired since the element isn\'t even in the dom tree');
    start();
  });

  setTimeout(function() { start(); }, 1000);
});


test('Check visiblePartX & visiblePartY parameters #1', function() {
  expect(2);
  stop(2000);

  this.element.css({
    right: '-25px',
    bottom: '-25px'
  }).appendTo('body');

  this.element.bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
    equals(visiblePartX, 'left', 'visiblePartX has correct value');
    equals(visiblePartY, 'top', 'visiblePartY has correct value');
    start();
  });
});


test('Check visiblePartX & visiblePartY parameters #2', function() {
  expect(2);
  stop(2000);

  this.element.css({
    right: '0',
    bottom: '-25px'
  }).appendTo('body');

  this.element.bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
    equals(visiblePartX, 'both', 'visiblePartX has correct value');
    equals(visiblePartY, 'top', 'visiblePartY has correct value');
    start();
  });
});


test('Check visiblePartX & visiblePartY parameters #3', function() {
  expect(2);
  stop(2000);

  this.element.css({
    right: '0',
    bottom: '0'
  }).appendTo('body');

  this.element.bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
    equals(visiblePartX, 'both', 'visiblePartX has correct value');
    equals(visiblePartY, 'both', 'visiblePartY has correct value');
    start();
  });
});


test('Check "live" events', function() {
  expect(3);
  stop(2000);
  
  var that = this,
      elems = $("body .test-container > div.test-element");
  elems.live("inview", function(event) {
    elems.die("inview");
    ok(true, "Live event correctly fired");
    equals(event.currentTarget, that.element[0], "event.currentTarget correctly set");
    equals(this, that.element[0], "Handler bound to target element");
    start();
  });
  
  this.element.css({
    top: '0',
    left: '0'
  }).appendTo(this.container);
});


test('Check "delegate" events', function() {
  expect(3);
  stop(2000);
  
  var that = this;
  this.container.delegate(".test-element", "inview", function(event) {
    ok(true, "Delegated event correctly fired");
    equals(event.currentTarget, that.element[0], "event.currentTarget correctly set");
    equals(this, that.element[0], "Handler bound to target element");
    start();
  });
  
  this.element.css({
    top: '0',
    left: '0'
  }).appendTo(this.container);
});