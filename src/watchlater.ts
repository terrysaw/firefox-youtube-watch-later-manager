function start()
{
	let observer : MutationObserver = new MutationObserver(() => {
		let message : string | number = "Hello, TypeScript"

		console.log(message)
	})

	observer.observe(document.body, { childList: true, subtree: true })
}


start()
