const p6 = t2.reduce((acc, curr) => {

	const Damascus = curr.provinceDeathcount["Damascus"] + curr.provinceDeathcount["Damascus_suburbs"];
	const Dimashq = curr.provinceDeathcount["Rif Dimashq2"] + curr.provinceDeathcount["Rif Dimashq"];
	//console.log(curr.provinceDeathcount["Rif Dimashq2"], curr.provinceDeathcount["Rif Dimashq"], Dimashq)
	const wynik = { ...curr.provinceDeathcount,
		"Damascus": Damascus,
		"Rif Dimashq": Dimashq
	}

	delete wynik["Rif Dimashq2"]
	delete wynik["Damascus_suburbs"]

	return { ...acc,
		[curr.date]: wynik
	}
}, {})

const p8 = t2.reduce((acc, curr) => {

	const wynik = { ...curr.provinceDeathcount
	}


	return { ...acc,
		[curr.date]: wynik
	}
}, {})