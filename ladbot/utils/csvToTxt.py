import csv
import sys

def main():
  f = open("Jackson.txt", "a", encoding="utf8")
  with open(sys.argv[1], "r", encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
      f.write(row[0] + "\n\n")


main()
