import os

def tree(dir_path, indent='', ignore_list=None):
    # Default ignore list includes common boilerplate directories
    if ignore_list is None:
        ignore_list = {'node_modules', '.git', '__pycache__', '.DS_Store', '.husky'}

    # Get the list of all files and directories in the given directory
    items = [item for item in os.listdir(dir_path) if item not in ignore_list]

    # Iterate over each item
    for index, item in enumerate(sorted(items)):
        # Check if it's the last item to use a different character
        if index == len(items) - 1:
            print(indent + '└── ' + item)
            new_indent = indent + '    '
        else:
            print(indent + '├── ' + item)
            new_indent = indent + '│   '

        # Get the full path of the item
        item_path = os.path.join(dir_path, item)

        # If it's a directory, recursively call the tree function
        if os.path.isdir(item_path):
            tree(item_path, new_indent, ignore_list)

# Call the tree function with the current directory
if __name__ == '__main__':
    project_root = os.path.dirname(os.path.abspath(__file__))
    print(project_root)
    tree(project_root)



    """Copyright

        This code is fully generated by chatgpt.com
    """
