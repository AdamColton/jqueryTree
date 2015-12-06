## jQuery Tree
This is a simple tree utility for jQuery. I could not find a good plugin that was configurable and supported lazy loading. This was built to be as configurable as possible while still having reasonable defaults, so most of the time, little configuration is needed.

### Demo
```js
function updateRoot(data){
  var files = $('#files');
  files.treeUnload().tree({
    val: "-- Root --",
    id: "root",
    childIcon: "<i class='fa fa-file-text-o'></i>",
    load: function(){
      $.post("/request", {foo: "bar", more: "requestData"}, this.treeLoader(), 'json');
    },
    click: Tree.toggleWrapper(function() {
      handleChild(this);
    })
  });
  files.treeLoad(data);
}
```

Configuration is inherited, so whatever the root of the tree is set to will propigate. Any child can have it's own settings, but those settings will propigate to it's children. In general, the values are only set for the root node.

### Configuration Values
- childIcon: The html to create the icon that will appear next to a child element (an element that has no children)
- parentOpenIcon: The html to create the icon that will appear next to a parent element when it is open
- parentClosedIcon: The html to create the icon that will appear next to a parent element when it is close
- iconWrapper: The html to produce an element into which the icon html will be inserted
- nodeWrapper: The html to produce an element into which the the icon and title will be inserted
- childrenWrapper: The html to produce an element into which the children nodes will be inserted
- childWrapper: The html to produce an element into which a single child node will be inserted
- hasChildren: boolean if the node has children. Useful for lazy loading
- click: function that will be called when the node is clicked
- load: function that can be called to load the children of a node

### jQuery Methods
- tree(config) : creates a tree. Config must have an id and will generally have a title.
- treeLoad([children]): children should be a list, children will inherit any settings not explicitly defined from their parent
- treeLoader(): returns a function that wraps treeLoad, useful for ajax callbacks
- treeUnload(): deletes a tree. This should be called to remove the tree, it cleans up internal data
- treeOpen(): shows child nodes
- treeClose(): hides child nodes
- treeToggle(): toggles the visibility of child nodes
- treeHasChildren(): returns a boolean indicating if the node has children

### Helper Functions
- toggleWrapper(func): takes a function, calls that function on child nodes, but calls toggle on parent nodes.

### Todo
* Init tree should support children