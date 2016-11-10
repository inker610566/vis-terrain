<template>
<div>
    <div v-show="!isUpdating">
        <router-link v-bind:class="['litem', {selected: visMapName=='offline'}]" :to="{name: 'vismap', mapName: 'offline'}" replace>offline</router-link>
        <router-link v-bind:class="['litem', {selected: visMapName==mname}]" v-for="mname in mapNames" :to="{name: 'vismap', mapName: mname}" replace>{{mname}}</router-link>
    </div>
    <div v-show="isUpdating">

    </div>
</div>
</template>
<script>
var MapNames = [null];
module.exports = {
    data: function(){
        return {mapNames: MapNames, isUpdating: false};
    },
    props: [
        'visMapName'
    ],
    beforeMount: function(){
        if(MapNames.length == 1 && MapNames[0] == null)
        {
            // retrieve existing mapNames from server
            MapNames.pop();
            Array.prototype.push.apply(MapNames, ['fakeName1', 'fakeName2']);
        }
    }
};
</script>
</script>
<style>
.selected {
background: #00b7e0;
}
.litem{
display: inline-block;
width: 100%;
height: 1em;
color: white;
text-decoration: none;
vertical-align: middle;
text-align: center;
font-size: 2em;
padding-top: .5em;
padding-bottom: .5em;
border-right-color: white;
border-top-color: white;
}
.litem:hover{
    color: skyblue;
    border-right-color: skyblue;
    border-top-color: skyblue;
}
</style>
