arc:
	rsync -aRv --delete --exclude=node_modules . /mnt/d/wwwcopy/github/starter
dep:
	cd dist && rsync -aRvz --delete --exclude-from=../.exclude . user@domen.ru:/var/www/domen.ru/html
