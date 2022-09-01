import React, { useState, useEffect, useRef, useMemo } from 'react';
import reactStringReplace from 'react-string-replace';
import Link from 'next/link';
import { isArray } from "../utils";

/** Regex patterns to use */
var patternMentions = /\B@[a-z0-9_.⍙-]+/gi;

/** Turns a did:pkh into a clean address and chain object */
export default function useCleanPostBody(post, characterLimit) {
  return parseMarkdown(post, characterLimit);;
}

/** This is a simple implementation of markdown, would love for this part to be improved by an external contributor */
function parseMarkdown(post, characterLimit) {
  /** We make sure the post has a content */
  if(!post || !post.content || !post.content.body) {
    return null;
  }

  let body = post.content.body;
  if(characterLimit) {
    body = post.content.body?.substring(0, characterLimit);
  }

  /** Make sure we don't go over the limitnof characters or disply a view more
  if(characterLimit && _body) {
    let _bodyWithoutUrl = _body.replaceAll(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gi, "");
    if(_bodyWithoutUrl.length > characterLimit) {
      _body = _body.substring(0, characterLimit) + "...";
    }
  } */

  /** Replace all <br> generated by the postbox to \n to handle line breaks */
  body = reactStringReplace(body, "<br>", function(match, i) {
    return <br key={match + i}/>;
  });

  body = reactStringReplace(body, '\n', function(match, i) {
    return <br key={match + i}/>;
  });

  /** Replace hashtags
  body = reactStringReplace(body, /#(\w+)/g, function(match, i) {
    return <Link key={match + i} href={`/search/${match}`}><>#{match}</></Link>
  }); */

  /** Replace URLs */
  body = reactStringReplace(body, /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g, function(match, i) {
    return <a key={match + i} href={match} target="_blank">{match}</a>
  });

  /** Identify and replace mentions */

  /** Get mentions in post metadata */
  let mentions = post.content.mentions;

  /** Retrieve mentions in the body */
  let mentionsInBody = post.content.body.toString().match(patternMentions);

  /** Compare both and replace in body */
  if(mentionsInBody && mentions && isArray(mentions)) {
    mentionsInBody.forEach(_m => {
      /** Find mention with the same name */
      let mention = mentions.find(obj => obj.username === _m);
      if(mention !== undefined) {
          body = reactStringReplace(body, _m, (match, i) => (
              mention.did ? <Link href={"/profile/" + mention.did} key={match + i}>{mention.username}</Link> : <span className="link" key={i}>{mention.username}</span>
          ));
      }
    });
  }

  return body;
}

/** Replace mentions in post */
function replaceMentions(post) {
  /** Get body from post */
  let _body = post.content.body;
  let body = post.content.body;



  /** Return result */
  return _body
}
