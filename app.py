import os 
import eel
from database.fieldsDB import get_all_fields, init_db

monitor = {
    "width": 750,
    "height": 700
}


init_db()

# change to directory of this script
os.chdir(os.path.dirname(__file__)) 
assert os.path.exists('web')

# intialising eel
eel.init('web', allowed_extensions=['.js', '.html', '.css'])

#functions exposed to javascript

eel.expose(get_all_fields)

#starting eel
eel.start('index.html', mode='edge',port=8080, size=(monitor['width'], monitor['height']))
