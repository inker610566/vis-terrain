<template>
<div>
<div style="width: 1000px;height: 700px;">
    <canvas width="700" height="700" id="cnvs"></canvas><sidebar vis-map-name="offline" style="display: inline-block;width: 30%;height: 100%;border:0;margin:0;padding:0; background: #222;overflow: scroll;"></sidebar><!--<router-view ></router-view>-->
</div>
<div>x: <input v-model="dx"></div>
<div>y: <input v-model="dy"></div>
<div>z: <input v-model="dz"></div>
<button v-on:click="Add(vterrain, dx, dy, dz)">Add</button>
</div>
</template>
<script>
var VisTerrain = require('../lib/VisTerrain.js');

module.exports = {
    components: {
        sidebar: require('./sidebar.vue')
    },
	data: function(){
		return {
            tdata: [], dx: 0, dy: 0, dz: 0,
            vterrain: {}
        };
	},
    mounted: function(){
        this.$data.vterrain = new VisTerrain(
            document.getElementById('cnvs'),
            [[1,1,1], [2,2,2], [3,3,3]]
        );
    },
    methods: {
        Add: function(terrain, x, y, z){
            terrain.Add(x, y, z);
            terrain.Update();
        }
    }
};
</script>
<style>
#cnvs{
    display: inline-block;
    width: 70%;height: 100%;border: 0;margin:0;padding:0;background: #145;
}
</style>
