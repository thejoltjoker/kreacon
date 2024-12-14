echo "# $(date '+%Y-%m-%d')\n" >> "$1"
echo "## Commits\n" >> "$1"

git_log=$(git log --since="midnight" --pretty=format:"- [%h](https://github.com/thejoltjoker/kreacon/commit/%h) - %s" --reverse)
echo "Commits for today:"
echo "$git_log"
echo "$git_log" >> "$1"

echo "\n## Notes\n" >> "$1"

read -p "Enter your reflections for today: " reflection
echo "$reflection" >> "$1"
echo "" >> "$1"
echo "---" >> "$1"