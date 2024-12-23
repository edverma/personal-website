export const prerender = true;

const nostrObject = {
    names: {
        _: "npub18hwy8hmnwk2t66qj3mxjqkkekcwk2p0hde5h6fm74zujtyvxk95qd6xcwr"
    },
    relays: {
        "npub18hwy8hmnwk2t66qj3mxjqkkekcwk2p0hde5h6fm74zujtyvxk95qd6xcwr": [ 
            "wss://brb.io", 
            "wss://eden.nostr.land",
            "wss://nos.lol",
            "wss://nostr.wine",
            "wss://premium.primal.net/",
            "wss://relay.current.fyi",
            "wss://relay.damus.io",
            "wss://relay.nostr.band",
            "wss://relay.orangepill.dev",
            "wss://relay.primal.net",
            "wss://relay.snort.social"
        ],
    }
}

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

export const GET = (request) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    if (nostrObject.names[name]) {
        const pubkey = nostrObject.names[name];
        const relays = nostrObject.relays[pubkey];
        const responseObject = {
            names: {
                [name]: pubkey
            },
            relays: {
                [pubkey]: relays
            }
        };
        return new Response(JSON.stringify(responseObject), { headers: headers });
    }
    
    return new Response(JSON.stringify(nostrObject), {headers: headers})
}
