#! /bin/sh
#
# run.sh
# Copyright (C) 2015 susy <susy@simbad>
#
# Distributed under terms of the MIT license.
#

#[[ -x $0 ]] && chmod +x $0

absdir=$(dirname $(dirname $(readlink -f $0)))
folder=$(basename $(readlink -f $(dirname $0)))

Pprint ()
{
    printf "\n$(tput setaf ${1})${2}$(tput sgr0)"
}

fail=$(Pprint 1 \✗)
good=$(Pprint 2 \✓)
hold=$(Pprint 3 \؟)

Depend ()
{
    pkg=$1
    hash "$pkg" 2>/dev/null && {
        printf "${good} Found command '${pkg}' on system path ..."
    } || {
        printf >&2 "$fail Command %s not found" $(Pprint 4 $pkg); missing=1
    }
}

Require ()
{
    typeset -a req
    req=$@ missing=0

    for pkg in ${req}; do Depend $pkg; done

    [[ $missing = 1 ]] && {
        printf "${fail} Missing dependencies, aborting ..."
        kill -INT $$
    }
    unset req missing pkg
}

Install ()
{
    Require npm
    Depend http-server
    if [[ $missing = 1 ]]; then

        while getopts "g" opt; do
            case $opt in
            (g)
                global='-g'
                ;;
            (*)  global=''
                ;;   
            esac
        done
        shift $((OPTIND-1))
        npm i $global $@
    fi
    printf "\n"
}

Run ()
{
    Install -g http-server
    printf "%s Change directory %s\n" $(Pprint 7 '⇒') $absdir; cd $absdir
    printf "%s " $(Pprint 6 '→')
    http-server $folder
}

Run


