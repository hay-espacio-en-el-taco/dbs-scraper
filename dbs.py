import urllib2
import re
import csv
import codecs
from datetime import datetime
from bs4 import BeautifulSoup

# specify the url
quote_page = 'http://www.dbs-cardgame.com/cardlist/?search=true&category=428001'

# query the website and return the html to the variable 'page'
page = urllib2.urlopen(quote_page)

# parse the html using beautiful soup and store in variable `soup`
soup = BeautifulSoup(page,'html.parser')

# Take out the <div> of name and get its value
dl_data = soup.find_all('dl', attrs={'class': 'cardListCol'})

# open a csv file with append, so old data will not be erased
# with codecs.open('index.csv','w','utf-8') as csv_file:
#   writer = csv.writer(csv_file)
csvfile = open('index.csv','a')
for dlitem in dl_data:
  number = dlitem.find('dt', attrs={'class': 'cardNumber'}).string
  name = dlitem.find('dd', attrs={'class': 'cardName'}).string
  series = dlitem.find('dl', attrs={'class': 'seriesCol'}).find('dd').string
  rarity = dlitem.find('dl', attrs={'class': 'rarityCol'}).find('dd').string
  cardType = dlitem.find('dl', attrs={'class': 'typeCol'}).find('dd').string
  color = dlitem.find('dl', attrs={'class': 'colorCol'}).find('dd').string
  if (cardType != 'LEADER'):
    energy = dlitem.find('dl', attrs={'class': 'energyCol'}).find('dd').string
  if (cardType == 'BATTLE'):
    comboEnergy = dlitem.find('dl', attrs={'class': 'comboEnergyCol'}).find('dd').string
    comboPower = dlitem.find('dl', attrs={'class': 'comboPowerCol'}).find('dd').string
  if (cardType != 'EXTRA'):
    power = dlitem.find('dl', attrs={'class': 'powerCol'}).find('dd').string
    character = dlitem.find('dl', attrs={'class': 'characterCol'}).find('dd').string
    specialTrait = dlitem.find('dl', attrs={'class': 'specialTraitCol'}).find('dd').string
    era = dlitem.find('dl', attrs={'class': 'eraCol'}).find('dd').string
  skill = dlitem.find('dl', attrs={'class': 'skillCol'}).find('dd').string
  if (cardType == 'BATTLE'):
    csvfile.write((number + ',' + name + ',' + series + ',' + rarity + ',' + cardType + ',' + color + ',' + energy + ',' + power + ',' + comboEnergy + ',' + comboPower + ',' + character + ',' + specialTrait + ',' + era + ',' + skill))
  if (cardType == 'LEADER'):
    csvfile.write(number + ',' + name + ',' + series + ',' + rarity + ',' + cardType + ',' + color + ',' + '' + ',' + power + ',' + '' + ',' + '' + ',' + character + ',' + specialTrait + ',' + era + ',' + skill)
  if (cardType == 'EXTRA'):
    csvfile.write(number + ',' + name + ',' + series + ',' + rarity + ',' + cardType + ',' + color + ',' + energy + ',' + 'N/A' + ',' + 'N/A' + ',' + 'N/A' + ',' + 'N/A' + ',' + 'N/A' + ',' + 'N/A' + ',' + skill)