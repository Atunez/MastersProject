import moss
import sys
import os
import shutil


# argv[1] will be a check to see what function to run...
mode = int(sys.argv[1])

def addSubmission():
    # In the case of addSubmission, you just need to know what to put, and what to name it...
    nameoffile = sys.argv[2]
    contentoffile = sys.argv[3]
    if not os.path.isdir("./submissions"):
        os.mkdir("./submissions")
    else:
        fp = open("./submissions/" + nameoffile, 'w')
        fp.write(contentoffile)
        fp.close()
    print("Added File")
    return

def runMoss():
    # In the case of running moss, then run on the submissions directory if it exists...
    if not os.path.isdir("./submissions"):
        print("No submissions")
        return
    userid = sys.argv[2]
    m = moss.Moss(userid, "java")
    m.addFilesByWildcard("./submissions/*.java")
    url = m.send()
    print(url)
    return

if mode == 1:
    addSubmission()
elif mode == 2:
    runMoss()
else:
    print(sys.argv)
    print("Error")




