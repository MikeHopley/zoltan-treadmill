const weaponsData = {
	lasers: {
		basic_laser: 10,
		burst_laser_1: 11,
		burst_laser_2: 12,
		burst_laser_3: 19,
		heavy_laser_1: 9,
		heavy_laser_2: 13,
		charge_laser_1: 6,
		charge_laser_2: 5,
		chain_laser: 16,
		vulcan: 11.1
	},
	flak: {
		flak_1: 10,
		flak_2: 21
	},
	ion: {
		ion_blast_1: 8,
		ion_blast_2: 4,
		heavy_ion: 13,
		ion_stunner: 10,
		chain_ion: 14,
		charge_ion: 6,
	},
	beams: {
		mini_beam: 12,
		hull_beam: 14,
		pike_beam: 16,
		halberd_beam: 17,
		glaive_beam: 25,
		fire_beam: 20
	},
	missiles: {
		leto_missile: 9,
		artemis_missile: 10,
		hermes_missile: 14,
		breach_missile: 22,
		swarm_missile: 7
	},
	bombs: {
		small_bomb: 13,
		fire_bomb: 15,
		stun_bomb: 17,
		ion_bomb: 22,
		lockdown_bomb: 15
	},
	crystal: {
		crystal_burst_1: 15,
		crystal_burst_2: 17,
		crystal_heavy_1: 13,
		crystal_heavy_2: 19
	}
}

const balanceModSource = {
	lasers: {
		burst_laser_3: 18,
		charge_laser_2: 4.5,
		chain_laser: 15
	},
	ion: {
		heavy_ion: 12,
		chain_ion: 12.5
	},
	beams: {
		halberd_beam: 18,
		fire_beam: 19
	},
	missiles: {
		breach_missile: 21,
		swarm_missile: 7
	},			
	bombs: {
		ion_bomb: 21,
		stun_bomb: 12,
		lockdown_bomb: 13
	},
	crystal: {
		crystal_burst_2: 14
	}			
}

Vue.component('treeselect', VueTreeselect.Treeselect)

var app = new Vue({
	el: '#app',
	data: {
		weapon1: null,
		weapon2: null,
		clearable: 'clearable',
		data: weaponsData,
		balanceModSource: balanceModSource,
		balanceMod: false,
		manning: false,
	},
	computed: {
		dashTime() {
			return 5.41 / 2.2
		},
		tilesBeforeFiring1() {
			return this.tiles(this.cooldown1)
		},
		tilesBeforeDash1() {
			return this.tiles(this.cooldown1 - this.dashTime)
		},
		cooldown1() {
			if (this.weapon1 == null) {
				return null
			}
			var levels = this.weapon1.split('.')
			return this.bonus * this.source[levels[0]][levels[1]]
		},
		tilesBeforeFiring2() {
			return this.tiles(this.cooldown2)
		},
		tilesBeforeDash2() {
			return this.tiles(this.cooldown2 - this.dashTime)
		},
		cooldown2() {
			if (this.weapon2 == null) {
				return null
			}
			var levels = this.weapon2.split('.')
			return this.bonus * this.source[levels[0]][levels[1]]
		},
		source() {
			return this.balanceMod ? this.balanceModData : this.data
		},
		bonus() {
			return this.manning ? 0.9 : 1
		},
		balanceModData() {
			result = {}
			entries = Object.entries(this.data)
			for(let i=0; i<entries.length; i++) {
				result[entries[i][0]] = this.mergeBalanceMod(
					entries[i][0], entries[i][1]
				)
			}
			return result
		},
		options() {
			let weapons = Object.entries(this.source)
			const result = []

			for (const [category, items] of weapons) {
				contents = []
				itemsArray = Object.entries(items)

				for (const [name, time] of itemsArray) {
					contents.push({
						id: category + '.' + name,
						label: this.readableName(name),
					})
				}

				result.push({
					id: category,
					label: this.readableName(category),
					children: contents
				}) 
			}
			return result
		}
	},
	methods: {
		tiles(time) {
			distance = time * 2.2
			return Math.round(distance * 10) / 10
		},

		readableName(name) {
			name = name.replace(/_/gi, ' ')
			return name.charAt(0).toUpperCase() + name.slice(1);
		},
		mergeBalanceMod(weaponClass, weapons) {
			if(!(weaponClass in this.balanceModSource)) {
				return weapons
			}
			balanceMod = this.balanceModSource[weaponClass]
			return {...weapons, ...balanceMod }
		}
	}
})
