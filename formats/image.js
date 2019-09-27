import { EmbedBlot } from 'parchment';
import { sanitize } from './link';

const ATTRIBUTES = ['alt', 'height', 'width'];

class Image extends EmbedBlot {
  static create(value) {
    const node = super.create(value);
    const span = document.createElement('span');
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
      span.setAttribute('href', this.sanitize(value));
      span.setAttribute('data-fancybox-href', this.sanitize(value.origin));
    }
    if (value.thumb) {
      node.setAttribute('src', this.sanitize(value.thumb));
    }
    if (value.origin) {
      span.setAttribute('href', this.sanitize(value.origin));
      span.setAttribute('data-fancybox-href', this.sanitize(value.origin));
    }
    span.setAttribute('data-fancybox-type', 'image');
    span.setAttribute('data-fancybox-group', 'editor');
    span.classList.add('fancybox');
    span.appendChild(node);
    return span;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static register() {
    if (/Firefox/i.test(navigator.userAgent)) {
      setTimeout(() => {
        // Disable image resizing in Firefox
        document.execCommand('enableObjectResizing', false, false);
      }, 1);
    }
  }

  static sanitize(url) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';

export default Image;
