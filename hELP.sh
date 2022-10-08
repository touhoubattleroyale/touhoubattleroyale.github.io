# a bash script that renames every png in the directory to 1.png, 2.png... etc.

# get the number of files in the directory

i=0

for file in *.png
do
    mv "$file" "$i.png"
    i=$((i+1))
done
