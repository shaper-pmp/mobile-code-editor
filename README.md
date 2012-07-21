# mobile-code-editor

Experimental re-imagining of the UI for editing code on touchscreen devices.

Highly experimental/work-in-progress - currently webkit only.

Todo:

* Refactor code so it operates on an abstract representation of the user's code that's then rendered to DOM elements for display/interaction, rather than directly on the DOM elements (as at present).
* Find a touch-friendlier way of entering statements than javascript confirm() dialogues.  Preferably one that can include predictive elements/autocomplete.