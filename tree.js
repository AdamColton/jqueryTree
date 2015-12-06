// Helper functions
var Tree = (function(){
  var tree = Object.create(null);
  tree.toggleWrapper = function(func){
    return function(){
      var self = $(this).parent();
      if (self.treeHasChildren()){
        self.treeToggle();
      } else {
        func.apply(self);
      }
    };
  }
  return tree;
}());

(function($){
  if ($ === undefined){
    throw "jQuery is required";
  }
  var _settings = Object.create(null);

  var _default = Object.create(null);
  _default.parentOpenIcon = '&dtrif;';
  _default.parentClosedIcon = '&rtrif;';
  _default.childIcon = '&bull;';
  _default.iconWrapper = "<i></i>";
  _default.nodeWrapper = "<span></span>";
  _default.childrenWrapper = "<ul></ul>";
  _default.childWrapper = "<li></li>";
  _default.click = function(){
    $(this).parent().treeToggle();
  }

  function _open(settings){
    if (settings.hasChildren === false){
      return;
    }
    if (!settings.loaded && settings.load !== undefined) {
      settings.loaded = true;
      settings.load.apply(settings.self, [true]);
    } else {
      settings.children.slideDown();
      settings.icon.html(settings.parentOpenIcon);
      settings.open = true;
    }
  }
  function _close(settings){
    if (settings.hasChildren === false){
      return;
    }
    settings.children.slideUp();
    settings.icon.html(settings.parentClosedIcon);
    settings.open = false;
  }
  function _getSettings(id){
    var settings = _settings[id];
    if (settings === undefined){
      throw "Node is not a tree";
    }
    return settings;
  }

  $.fn.tree = function(data, inherits){
    //get settings
    var settings = Object.create(null);
    inherits = inherits || {};
    settings.click = data.click || inherits.click || _default.click;
    settings.parentOpenIcon = data.parentOpenIcon || inherits.parentOpenIcon || _default.parentOpenIcon;
    settings.parentClosedIcon = data.parentClosedIcon || inherits.parentClosedIcon || _default.parentClosedIcon;
    settings.childIcon = data.childIcon || inherits.childIcon || _default.childIcon;
    settings.iconWrapper = data.iconWrapper || inherits.iconWrapper || _default.iconWrapper;
    settings.nodeWrapper = data.nodeWrapper || inherits.nodeWrapper || _default.nodeWrapper;
    settings.childrenWrapper = data.childrenWrapper || inherits.childrenWrapper || _default.childrenWrapper;
    settings.childWrapper = data.childWrapper || inherits.childWrapper || _default.childWrapper;
    settings.load = data.load || inherits.load;
    settings.hasChildren = !!data.hasChildren;
    settings.loaded = false;
    settings.open = false;
    settings.self = $(this);

    //Create the icon
    settings.icon = $(settings.iconWrapper).addClass("treeIcon");
    if (settings.hasChildren){
      settings.icon.html(settings.parentClosedIcon);
    } else {
      settings.icon.html(settings.childIcon);
    }
    // create the node (holds the icon and the title
    var node = $(settings.nodeWrapper).addClass('treeNode').html(settings.icon).append(data.title);
    if (settings.click){
      node.click(settings.click);
    }
    // create children container
    settings.children = $(settings.childrenWrapper).addClass("treeChildren");
    // append node and children to target
    this.append(node);
    this.append(settings.children);
    this.addClass("tree");
    _settings[this.attr('id')] = settings;
    return this;
  };
  var killSwitch = 0;
  $.fn.treeLoad = function(data){
    console.log(data);
    killSwitch++;
    if (killSwitch >50){
      return;
    }
    if (data == undefined){
      if (settings.load !== undefined){
        settings.load.apply(this);
      }
      return;
    }
    var settings = _getSettings(this.attr('id'));
    var child;
    settings.loaded = true;
    settings.hasChildren = true;
    for(var i=0; i<data.length; i++){
      child = $(settings.childWrapper).attr('id',data[i].id);
      child.tree(data[i], settings);
      settings.children.append(child);
      if (data[i].children !== undefined){
        child.treeLoad(data[i].children);
      }
    }
    _open(settings);
  };
  $.fn.treeLoader = function(){
    var self = $(this);
    return function(data){
      self.treeLoad(data);
    }
  }
  $.fn.treeUnload = function(){
    try{
      var settings = _getSettings(this.attr('id'));
      if (settings.hasChildren){
        settings.children.each(function(){
          $(this).treeUnload();
        });
      }
    } catch(err){}
    var self = $(this);
    self.empty();
    return self;
  }
  $.fn.treeOpen = function(){
    _open(_getSettings(this.attr('id')));
  }
  $.fn.treeClose = function(){
    _close(_getSettings(this.attr('id')));
  }
  $.fn.treeToggle = function(){
    var settings = _getSettings(this.attr('id'));
    (settings.open ? _close : _open)(settings);
  }
  $.fn.treeHasChildren = function(){
    return _getSettings(this.attr('id')).hasChildren;
  }
})(jQuery);