/* ============================================================
   BIRTHDAY — Root app component
   ============================================================ */

import { Component } from 'valen';
import Main from './Main.js';

function Birthday() {
  return {
    mount: '#app',
    template: `<Main />`
  };
}

const BIRTHDAY = Component(Birthday);

export default BIRTHDAY;