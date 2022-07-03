// api=https://restcountries.com/v3/all?fields=name,flags

let data = [];

axios
	.get("https://restcountries.com/v3/all?fields=name,flags")
	.then((res) => {
		data = res.data;
	})
	.catch((err) => {
		console.error(err);
	});

    