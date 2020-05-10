(function(e){function t(t){for(var s,i,l=t[0],o=t[1],c=t[2],d=0,p=[];d<l.length;d++)i=l[d],Object.prototype.hasOwnProperty.call(n,i)&&n[i]&&p.push(n[i][0]),n[i]=0;for(s in o)Object.prototype.hasOwnProperty.call(o,s)&&(e[s]=o[s]);u&&u(t);while(p.length)p.shift()();return r.push.apply(r,c||[]),a()}function a(){for(var e,t=0;t<r.length;t++){for(var a=r[t],s=!0,l=1;l<a.length;l++){var o=a[l];0!==n[o]&&(s=!1)}s&&(r.splice(t--,1),e=i(i.s=a[0]))}return e}var s={},n={app:0},r=[];function i(t){if(s[t])return s[t].exports;var a=s[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=e,i.c=s,i.d=function(e,t,a){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)i.d(a,s,function(t){return e[t]}.bind(null,s));return a},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],o=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var u=o;r.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("56d7")},"56d7":function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var s=a("2b0e"),n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"app"}},[a("div",{staticClass:"wrapper",class:[e.getColors()],attrs:{id:"fenix"}},[a("div",{class:{spinnerVisible:e.loading},attrs:{id:"fenix-spinner"}},[a("b-spinner")],1),a("Sidebar",{attrs:{loading:e.loading,languages:e.languages,categories:e.categories}}),a("div",{class:{filterVisible:e.loading},attrs:{id:"content"}},[a("Topbar"),a("section",{attrs:{id:"section-templates"}},e._l(e.filteredTemplates,(function(e){return a("Template",{attrs:{template:e}})})),1)],1)],1)])},r=[],i=(a("4de4"),a("7db0"),a("4160"),a("caad"),a("c975"),a("d3b7"),a("6062"),a("2532"),a("3ca3"),a("159b"),a("ddb0"),a("2909")),l=a("5530"),o=a("2f62"),c=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{key:e.template.id,class:{active:e.isSelected(e.template.id),template:!0},attrs:{id:"template-"+e.template.id},on:{click:function(t){return e.selectTemplate(e.template.id)}}},[a("div",{key:e.template.id,staticClass:"template template-body",attrs:{template:e.template,id:e.template.id,hasform:e.template.hasForm,"data-toggle":"list"}},[a("img",{staticClass:"language-logo",attrs:{src:e.template.img,alt:""}}),a("div",{staticClass:"template-data"},[a("div",{staticClass:"d-flex w-100 justify-content-between"},[a("h5",{staticClass:"language-name mb-1"},[e._v(e._s(e.template.displayName))]),a("small",{staticClass:"template-reponame text-muted"},[e._v(e._s(e.template.repoName))])]),a("p",{staticClass:"mb-1 template-description"},[e._v(e._s(e.template.description))]),a("small",{staticClass:"text-muted template-author"},[e._v(e._s(e.template.author))])])]),e.template.environment?a("b-form",{staticClass:"fnx-form",class:{"fnx-form-hidden":!e.isSelected(e.template.id)},attrs:{id:"next-form-"+e.template.id}},e._l(e.template.environment,(function(t){return a("div",{key:t.id,staticClass:"form-group"},[a("label",{attrs:{for:t.id}},[e._v(e._s(t.title))]),a("input",{staticClass:"form-control",attrs:{type:"text",id:"form-control-"+e.template.id+"-"+t.id,placeholder:t.default||t.title},on:{input:function(a){e.variables[t.id]=a.target.value}}}),a("small",{staticClass:"form-text",attrs:{id:"emailHelp"}},[e._v(e._s(t.description))])])})),0):e._e()],1)},u=[],d={props:["template"],computed:Object(l["a"])({variables:{get:function(){return this.$store.state.variables},set:function(e){this.$store.commit("setVariables",e)}}},Object(o["c"])(["selectedTemplate"])),methods:Object(l["a"])({isSelected:function(e){return this.selectedTemplate===e}},Object(o["b"])(["selectTemplate"]))},p=d,m=(a("690c"),a("2877")),f=Object(m["a"])(p,c,u,!1,null,null,null),g=f.exports,b=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("nav",{class:{filterVisible:e.loading},attrs:{id:"sidebar"}},[a("div",{staticClass:"sidebar-header"},[a("img",{staticStyle:{float:"left"},attrs:{src:"http://fenix.acharluk.xyz/logo.png",alt:"Fenix Logo",width:"60px"}}),a("h3",{staticStyle:{"margin-top":"15px"}},[e._v(" Fenix "),a("small",{staticStyle:{"font-size":"small"}},[e._v("("+e._s(e.connector.getName())+")")])])]),a("ul",{staticClass:"list-unstyled components"},[a("li",{staticClass:"fenix-filter"},[a("a",{staticClass:"dropdown-toggle",attrs:{href:"#homeSubmenu","data-toggle":"collapse","aria-expanded":"true"}},[e._v("Language")]),a("ul",{staticClass:"list-unstyled show",attrs:{id:"homeSubmenu"}},e._l(e.languages,(function(t){return a("li",{key:t},[a("a",{staticClass:"fnx-language",attrs:{href:"#"},on:{click:function(a){return e.filterByLanguage(t)}}},[e._v(e._s(t))])])})),0)]),a("li",{staticClass:"fenix-filter"},[a("a",{staticClass:"dropdown-toggle",attrs:{href:"#pageSubmenu","data-toggle":"collapse","aria-expanded":"true"}},[e._v("Category")]),a("ul",{staticClass:"list-unstyled show",attrs:{id:"pageSubmenu"}},e._l(e.categories,(function(t){return a("li",{key:t},[a("a",{staticClass:"fnx-category",attrs:{href:"#"},on:{click:function(a){return e.filterByCategory(t)}}},[e._v(e._s(t))])])})),0)])]),a("ul",{staticClass:"list-unstyled CTAs"},[a("li",[a("b-button",{attrs:{variant:"danger",id:"fnx-btn-clear-filter"},on:{click:e.removeFilters}},[e._v("Clear filters")])],1)])])},h=[],v={props:["loading","languages","categories"],computed:Object(o["c"])(["connector"]),methods:{filterByLanguage:function(e){this.selectedLanguage=e},filterByCategory:function(e){this.selectedCategory=e},removeFilters:function(){this.selectedLanguage=null,this.selectedCategory=null}}},y=v,T=(a("f203"),Object(m["a"])(y,b,h,!1,null,null,null)),_=T.exports,x=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"topbar"}},[a("b-button",{attrs:{variant:"warning",id:"topbar__btn-settings"}},[a("font-awesome-icon",{attrs:{icon:["fas","cogs"]}}),a("span",{attrs:{id:"btn-create-text"}},[e._v("Settings")])],1),a("b-button",{attrs:{variant:"success",id:"btn-more-templates"}},[a("font-awesome-icon",{attrs:{icon:["fas","plus-circle"]}}),a("span",{attrs:{id:"btn-create-text"}},[e._v("More templates")])],1),a("b-input-group",{attrs:{id:"topbar__search"}},[a("b-form-input",{attrs:{placeholder:"Search templates"},model:{value:e.searchTerm,callback:function(t){e.searchTerm=t},expression:"searchTerm"}})],1),a("b-button",{attrs:{variant:"primary",disabled:!e.selectedTemplate,id:"topbar__btn-create"},on:{click:e.runTemplate}},[a("font-awesome-icon",{attrs:{icon:["fas","rocket"]}}),a("span",{attrs:{id:"btn-create-text"}},[e._v("Create")])],1)],1)},C=[],w={computed:Object(l["a"])({searchTerm:{get:function(){return this.$store.state.searchTerm},set:function(e){this.$store.commit("setSearchTerm",e)}}},Object(o["c"])(["selectedTemplate","connector","variables"])),methods:{runTemplate:function(){this.connector.runTemplate(this.selectedTemplate,this.variables)}}},j=w,O=(a("fb46"),Object(m["a"])(j,x,C,!1,null,null,null)),k=O.exports,S={name:"App",components:{Template:g,Sidebar:_,Topbar:k},computed:Object(l["a"])({selectedTemplate:{get:function(){return this.$store.state.selectedTemplate},set:function(e){this.$store.commit("setSelectedTemplate",e)}},searchTerm:{get:function(){return this.$store.state.searchTerm},set:function(e){this.$store.commit("setSearchTerm",e)}},categories:function(){var e=new Set;return this.templates.forEach((function(t){e.add.apply(e,Object(i["a"])(t.categories))})),e},languages:function(){var e=new Set;return this.templates.forEach((function(t){"string"===typeof t.language?e.add(t.language):e.add.apply(e,Object(i["a"])(t.language))})),e},environment:function(){var e=this;return this.selectedTemplate?this.templates.find((function(t){return t.id==e.selectedTemplate})).environment:[]},filteredTemplates:function(){var e,t=this.selectedLanguage,a=this.selectedCategory,s=this.searchTerm;return e=t||a?this.templates.filter((function(e){return e.categories.includes(a)||e.language===t})):this.templates,s&&(e=e.filter((function(e){return e.id.toLowerCase().indexOf(s.toLowerCase())>-1||e.displayName.toLowerCase().indexOf(s.toLowerCase())>-1}))),e}},Object(o["c"])(["templates","repositories","repoFields","variables","selectedLanguage","loading","connector"])),created:function(){this.loadTemplates()},methods:Object(l["a"])({getColors:function(){return"undefined"!==typeof acquireVsCodeApi?"vscode_colors":"web_colors"}},Object(o["b"])(["loadTemplates","selectTemplate"]))},L=S,$=(a("5c0b"),Object(m["a"])(L,n,r,!1,null,null,null)),M=$.exports,F=(a("d81d"),a("d4ec")),V=a("bee2"),N=function(){function e(){Object(F["a"])(this,e)}return Object(V["a"])(e,[{key:"getName",value:function(){return"web"}},{key:"runTemplate",value:function(e,t){alert("Template: "+e),console.log("Template",e),console.log("Variables",t)}},{key:"loadTemplates",value:function(e){fetch("https://raw.githubusercontent.com/acharluk/FenixDefaultTemplates/master/fenix.json").then((function(e){return e.json()})).then((function(t){var a={templates:t.templates.map((function(e){return Object(l["a"])(Object(l["a"])({},e),{},{author:t.author,repoName:t.repoName})})),repositories:["https://raw.githubusercontent.com/acharluk/FenixDefaultTemplates/master/fenix.json"]};e(a)}))}},{key:"postMessage",value:function(){}}]),e}(),E=N,P=function(){function e(){Object(F["a"])(this,e),this.vscode=acquireVsCodeApi()}return Object(V["a"])(e,[{key:"getName",value:function(){return"vscode"}},{key:"runTemplate",value:function(e,t){this.vscode.postMessage({command:"create",id:e,vars:t})}},{key:"loadTemplates",value:function(e){window.addEventListener("message",(function(t){switch(t.data.command){case"load":var a={templates:t.data.templates,repositories:t.data.repositories};e(a);break;default:break}}))}},{key:"postMessage",value:function(e){this.vscode.postMessage(e)}}]),e}(),A=P;s["default"].use(o["a"]);var B=new o["a"].Store({state:{templates:[],repositories:[],repoFields:["url","delete"],variables:{},selectedTemplate:null,selectedLanguage:null,selectedCategory:null,searchTerm:"",loading:!0,connector:"undefined"!==typeof acquireVsCodeApi?new A:new E},mutations:{setTemplates:function(e,t){e.templates=t},setRepositories:function(e,t){e.repositories=t},setLoading:function(e,t){e.loading=t},setSelectedTemplate:function(e,t){e.selectedTemplate=t},setSearchTerm:function(e,t){e.searchTerm=t},setVariables:function(e,t){e.variables=t}},actions:{loadTemplates:function(e){e.state.connector.loadTemplates((function(t){e.commit("setTemplates",t.templates),e.commit("setRepositories",t.repositories),e.commit("setLoading",!1)})),e.state.connector.postMessage({command:"ready"})},selectTemplate:function(e,t){e.commit("setSelectedTemplate",t)}},modules:{}}),q=a("5f5b"),z=a("b1e0"),D=a("ecee"),J=a("c074"),R=a("ad3d");a("f9e3"),a("2dd8"),a("9977");D["c"].add(J["a"],J["b"],J["c"]),s["default"].component("font-awesome-icon",R["a"]),s["default"].config.productionTip=!1,s["default"].use(q["a"]),s["default"].use(z["a"]),new s["default"]({store:B,render:function(e){return e(M)}}).$mount("#app")},"5c0b":function(e,t,a){"use strict";var s=a("9c0c"),n=a.n(s);n.a},"690c":function(e,t,a){"use strict";var s=a("8321"),n=a.n(s);n.a},8321:function(e,t,a){},9741:function(e,t,a){},"9c0c":function(e,t,a){},bf77:function(e,t,a){},f203:function(e,t,a){"use strict";var s=a("9741"),n=a.n(s);n.a},fb46:function(e,t,a){"use strict";var s=a("bf77"),n=a.n(s);n.a}});
//# sourceMappingURL=app.506a1f98.js.map