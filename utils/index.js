
import path from 'path';
import { basename } from './../utils/fs'
import { prop, flip, curry, not, identical, compose } from 'ramda';

// getIndexValue :: [a] -> Int -> a
export const getIndexValue = arr => index => flip(curry(prop))(arr)(index);

// gotWhiteSpaces :: String -> Maybe a b
export const gotWhiteSpaces = x => /\s/g.test(x);


export const map = f => xs => xs.map(f);
export const filter = f => xs => xs.filter(f);


// toJSON :: Sting -> Object
export const toJSON = str => JSON.parse(str);

// stringify :: Object -> String
export const stringify = o => JSON.stringify(o, null, 2); 

// ignoreHidden :: String -> Boolean
export const ignoreHidden = x =>  x.substring(0, 1) !== '.';

// toString :: * -> String
export const toString = a => a.toString();
// splitCodeLines :: String -> [ String ]
export const splitCodeLines = code => code.split('\n');

// log :: String -> a -> a
export const log = label => x =>
(console.log(`[${label}]:`, x), x)

// ignoreByName :: String -> Boolean
export const ignoreByName = name => compose(not, curry(identical)(name), basename)

// getFileByExtension :: String -> String -> Boolean
export const getFileByExtension = ext => file => ext === path.extname(file).substring(1);