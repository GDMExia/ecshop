webpackJsonp([52],{NSOq:function(t,e){},mBGL:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("mvHQ"),s=i.n(n),o=(i("vAZe"),i("Au9i")),r=i("RuWt"),a=i("vMJZ"),c={name:"Bind",data:function(){return{items:[]}},created:function(){var t=this;o.Indicator.open(),a.b().then(function(e){o.Indicator.close(),e&&e.signup_field&&(t.items=e.signup_field)},function(t){o.Indicator.close(),Object(o.Toast)(t.errorMsg)})},mounted:function(){},methods:{getPlaceholder:function(t){return"请填写"+(t&&t.name?t.name:"")},isShowLine:function(t){return!this.items||!this.items.length||t!==this.items.length-1},goBack:function(){this.$router.go(-1)},onSkip:function(){this.goHome()},goHome:function(){this.$router.push("/home")},onSubmit:function(){var t=this,e=new Array;if(this.items&&this.items.length){for(var i=0;i<this.$refs.form.children.length;i++){var n=this.$refs.form.children[i],c=new Object;if(c.id=this.items[i].id,c.is_required=this.items[i].is_required,c.value=n.__vue__.value,c.is_required&&!c.value)return void Object(o.Toast)("请填写"+this.items[i].name);e.push(c)}o.Indicator.open();var l=e&&e.length?s()(e):null;a.d(l,r.a.PROFILE_GENDER.UNKNOWN,null,null).then(function(e){o.Indicator.close(),Object(o.Toast)("完善信息成功"),t.goHome()},function(t){o.Indicator.close(),Object(o.Toast)(t.errorMsg)})}}}},l={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"container"},[i("mt-header",{staticClass:"header",attrs:{fixed:"",title:"完善资料"}},[i("header-item",{attrs:{slot:"left",isBack:!0},on:{onclick:t.goBack},slot:"left"}),t._v(" "),i("header-item",{attrs:{slot:"right",title:"跳过"},on:{onclick:t.onSkip},slot:"right"})],1),t._v(" "),i("div",{ref:"form",staticClass:"content"},t._l(t.items,function(e,n){return i("form-input-item",{key:n,staticClass:"item",attrs:{title:e.name,default:e.value,isRequired:e.is_required,isShowLine:t.isShowLine(n),placeholder:t.getPlaceholder(e)}})})),t._v(" "),i("label",{staticClass:"tips"},[t._v("带“*”为必填项")]),t._v(" "),i("gk-button",{staticClass:"button",attrs:{type:"primary"},on:{click:t.onSubmit}},[t._v("完成")])],1)},staticRenderFns:[]};var u=i("VU/8")(c,l,!1,function(t){i("NSOq")},"data-v-7773f490",null);e.default=u.exports}});
//# sourceMappingURL=52.04b2b843bfabe085c48e.js.map