// Copyright 2015 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --expose-debug-as debug

Debug = debug.Debug

var exception = null;
function listener(event, exec_state, event_data, data) {
  if (event != Debug.DebugEvent.Break) return;
  try {
    exec_state.frame(0).evaluate("bar()");
  } catch (e) {
    exception = e;
    print(e + e.stack);
  }
}

Debug.setListener(listener);

(function() {
  "use strict";
  try {
    throw 1;
  } catch (e) {
    let a = 1;
    function bar() {
      a = 2;  // this has no effect, when called from debug-eval
      e = 2;  // this has no effect, when called from debug-eval.
    }
    debugger;
    assertEquals(1, a);
    assertEquals(1, e);
  }
})();

Debug.setListener(null);
assertNull(exception);