const a3 = table.reduce((acc, curr) => {
    return {
        ...acc,
        [curr.Date]: {
            ...Object.keys(curr).reduce((acc2, curr2) => {
                // if (curr2 === "Cyprus" && curr.Date === "2013-03") {
                if (curr2 === "Date") {

                    return acc2
                } else {
                    var t = 0

                    // if (curr2 === "Portugal" ) {
                        // debugger
                        var keys = Object.keys(acc)
                        if (keys.length >= 1) {
                            const k = keys[keys.length - 1]
                            // console.log(acc[k], curr2, acc[k][curr2])
                            t = acc[k][curr2]
                        }
                    // }

                    
                        // console.log(curr.Date, curr[curr2], t)
                    // }

                    return {
                        ...acc2,
                        [curr2]: curr[curr2] + t
                    }
                }
            }, {})
        }
    }
}, {})



const table = data2.refugees.reduce((acc, curr) => {
	return [...acc, curr}]
}, [])


const a3 = table.reduce((acc, curr) => {
    return {
        ...acc,
        [curr.Date]: {
            ...Object.keys(curr).reduce((acc2, curr2) => {
                // if (curr2 === "Cyprus" && curr.Date === "2013-03") {
                if (curr2 === "Date") {

                    return acc2
                } else {
                    var t = 0

                    // if (curr2 === "Portugal" ) {
                        // debugger
                        var keys = Object.keys(acc)
                        if (keys.length >= 1) {
                            const k = keys[keys.length - 1]
                            // console.log(acc[k], curr2, acc[k][curr2])
                            t = acc[k][curr2]
                        }
                    // }

                    
                        // console.log(curr.Date, curr[curr2], t)
                    // }

                    return {
                        ...acc2,
                        [curr2]: curr[curr2] + t
                    }
                }
            }, {})
        }
    }
}, {})