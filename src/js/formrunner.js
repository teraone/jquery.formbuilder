/**
 * formrunner
 * Copyright (c) 2009, 2014 (v2) Mike Botsko, Helion3 LLC (http://www.helion3.com)
 * http://www.botsko.net/blog/2009/04/jquery-form-builder-plugin/
 * Originally designed for AspenMSM, a CMS product from Trellis Development
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 */
var Formrunner = function(opts){

  if( typeof opts.targets !== 'object' || opts.targets.length === 0 ){
    throw new Error('Invalid or missing target element(s)');
  }

  // Define all default options
  var defaultOptions = {

    // Id to refer to this form specifically
    form_id: false,

    // Injected model, allows us to start with an
    // existing form
    model: false,

    // A dom-lib wrapped element
    targets: false,

    // injected values to fill the form on init
    values: {},

    // URL to submit form results to
    action: '',

    // Form submission method
    method: 'POST',

    // Customizable base for templates
    templateBasePath: 'templates/runner',

    // prefix added before template file name
    templatePrefix: 'runner-'

  };

  var _privateSelf = this;
  this._opts = $.extend(true, {}, defaultOptions,opts);

  // TODO: fix bug here (multiple instance case)

  // Dynamically load templates
  if( dust.onLoad === undefined ){
    dust.onLoad = function(name, callback) {
      $.ajax(_privateSelf._opts.templateBasePath + '/' + name + '.tpl', {
        success: function(data) {
          callback(undefined, data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          callback(textStatus, undefined);
        }
      });
    };
  }

  this.render();

  return this;

};

// Sort field models by sortOrder
var sortObject = function(obj){
  var arr = [];
  for (var prop in obj){
    if (obj.hasOwnProperty(prop)){
      arr.push({
        'key': prop,
        'value': obj[prop].sortOrder
      });
    }
  }
  arr.sort(function(a, b){ return a.value - b.value; });

  var result = [];
  for( var i = 0, l = arr.length; i < l; i++ ){
    var key = arr[i].key;
    result.push(obj[key]);
  }

  return result;
};

Formrunner.prototype = {

  // store options
  _opts: false,

  /**
   * Render the form editor
   * @return {[type]} [description]
   */
  render: function(){

    var self = this;

    // Pass data to the original rendering
    var frmObj = {
      form_id: self._opts.form_id,
      action: self._opts.action,
      method: self._opts.method
    };

    // Load base form template
    dust.render(self._opts.templatePrefix + 'base', frmObj, function(err, out) {

      // Append content
      self._opts.targets.append( out );

      // Sort incoming models
      var sorted = sortObject(self._opts.model);

      // Iterate model and render proper editors
      $.each(sorted,function(index,model){
        self.appendElementForModel(model);
      });

    });
  },

  /**
   * Append a rendered form element for a model
   * @param object model Form model from the builder
   */
  appendElementForModel: function( model ){

    var self = this;


    // Pass data to the template
    var frmObj = {
      // set unique id
      id: self.fieldNameToId(model.fbid),
      label: model.label,
      required: model.required,
      selected: model.selected
    };

    // set value
    if (self._opts.values && self._opts.values[frmObj.id] !== undefined)
    {
      frmObj.value = self._opts.values[frmObj.id];
      // case obj is selectable
      frmObj.selected = self._opts.values[frmObj.id];
    }

    // Load and render the html template for the form
    dust.render(self._opts.templatePrefix + model.type, frmObj, function(err, out){

      // Set base template
      self._opts.targets.find('.frmb-form>ul').append( out );

      var lastLi = self._opts.targets.find('.frmb-form>ul>li:last-child');

      // Build choices
      if( model.choices !== undefined && model.choices.length > 0 ){
        $.each(model.choices,function(key,choice){

          // set unique id
          choice.id       = self.fieldNameToId( model.fbid + '_' + key );
          choice.name     = self.fieldNameToId(model.label);
          choice.value    = '&nbsp;';       // set value as a space to fit required check
          choice.required = model.required; // pass required property to add attribute in choices

          // set value
          if (self._opts.values && self._opts.values[choice.id] !== undefined) 
          {
            choice.selected = self._opts.values[choice.id];
          }

          // Load choice template
          dust.render(self._opts.templatePrefix + model.type + '-choices', choice, function(err, out){

            if( model.type === 'select' ){
              lastLi.find('select').append(out);
            } else {
              lastLi.find('.frmb-choices').append(out);
            }
          });
        });
      }
    });
  },

  /**
   * Convert a field label to an html/backend-valid ID/name
   * @param  string name Label to convert
   * @return string HTML/backend-safe string
   */
  fieldNameToId: function( name ){
    return name.toLowerCase().replace(/ /g,'-').replace(/[^a-zA-Z0-9_.-]/g, '');
  },

  /**
   * get all submittable elements values
   *
   * @method     getData
   * @return     {object}  id => value
   */
  getData: function()
  {
    var self  = this;
    var data  = {};
    var parts = this.getSubmittableElements();

    // loop parts
    parts.each(function()
    {
      var jqElement = $(this);
      var val;

      if (jqElement.attr('type') === 'checkbox' || jqElement.attr('type') === 'radio')
      {
        val = jqElement.prop('checked');
      }
      else if (jqElement.prop('tagName').toLowerCase() === 'option' || jqElement.attr('type') === 'radio')
      {
        val = jqElement.prop('selected');
      }
      else
      {
        val = jqElement.val();
      }

      // store value with id as key
      data[this.id] = val;
    });

    return data;
  },

  getSubmittableElements: function()
  {
    return this._opts.targets.find('input, option, textarea');
  },

  /**
   * prevent all submitable elements in the form to be submitted
   *
   * @method     preventSubmit
   */
  disable: function()
  {
    this._opts.targets.find('input').prop('disabled',true);
  },

  /**
   * prevent all submitable elements in the form to be submitted
   *
   * @method     preventSubmit
   */
  preventSubmit: function()
  {
    this._opts.targets.find('input').prop('name','');
  }
};