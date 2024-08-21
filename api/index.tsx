import { Button, Frog, TextInput } from 'frog'
import { Box, Heading, Text, Rows, Row, Divider, Image, Columns, Column, vars } from './ui.js'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { neynar } from 'frog/middlewares'

const SITE_URL = "https://check-enjoy-stats-v2.vercel.app/";
// const SITE_URL = "https://5909-27-79-177-3.ngrok-free.app/";

export const app = new Frog({
  title: 'Check $ENJOY Start By Dangs',
  assetsPath: '/',
  basePath: '/api',
  ui: { vars },
  imageOptions: {
    height: 426,
    width: 816,
  },
  // Supply a Hub to enable frame verification.
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      headers: {
        "x-airstack-hubs": "19d52024f5e694eedbdf857f4a7e84bd8",
      }
    }
  }
}).use(
  neynar({
    apiKey: 'NEYNAR_FROG_FM',
    features: ['interactor', 'cast'],
  }),
)

function Content(balance:string, remaining:number, unique_mints:string, unique_collectors:string, allowance:number, score:string) {
  return <Row paddingLeft="64" height="5/7"> 
          <Columns gap="8" grow> 
            <Column width="1/7" />
            <Column width="4/7"> 
              <Rows gap="8" grow>
                <Row height="1/7" > <Heading size="20"> Tipping Balance</Heading> </Row>
                <Row paddingLeft="12" height="2/7" > 
                  <Columns gap="8" grow> 
                    <Column alignVertical='bottom' width="3/7"> <Text>- Allowance: </Text> </Column>
                    <Column width="4/7"> <Text align='right' color="main" weight="900" size="20"> { allowance } </Text> </Column>
                  </Columns>
                  <Columns gap="8" grow> 
                    <Column alignVertical='bottom' width="3/7"> <Text>- Remaining: </Text> </Column>
                    <Column width="4/7"> <Text color="main" align='right' weight="900" size="20">{ remaining.toLocaleString() }</Text> </Column>
                  </Columns>
                </Row>
                <Divider />
                <Row height="1/7" > <Heading size="20"> Other Information </Heading> </Row>
                <Row paddingLeft="12" height="2/7" > 
                  <Columns gap="8" grow> 
                    <Column alignVertical='bottom' width="3/7"> <Text>- Unique Mints: </Text> </Column>
                    <Column width="4/7"> <Text color="main" align='right' weight="900" size="20"> { unique_mints } </Text> </Column>
                  </Columns>
                  <Columns gap="8" grow> 
                    <Column alignVertical='bottom' width="5/7"> <Text>- Unique Collectors: </Text> </Column>
                    <Column width="2/7"> <Text color="main" align='right' weight="900" size="20">{ unique_collectors }</Text> </Column>
                  </Columns>
                </Row>
              </Rows>
            </Column>
            <Column width="2/7" />
          </Columns>
        </Row>;
}

function MakeID(length:number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function checkFollowed(username:string) {
  var res = await fetch("https://client.warpcast.com/v2/user-by-username?username="+username ,{ method:"GET", headers: {
    "content-type": 'application/json; charset=utf-8',
    'Authorization': 'Bearer MK-xrcZPv8Mzdebn6js71AYceKoz0y7UksQWHy9jb5yK9eW6E+sTMVSjwJM1vrVBHj0N1E91naFqSVmMjf/akMzdg=='
  }});

  var { result } = JSON.parse(await res.text()) || {};
  var { user } = result || {};
  var { viewerContext } = user || {};
  var { followedBy } = viewerContext || false;

  return followedBy;
}

app.frame('/', async (c) => {
  console.log(1);
  
  const { frameData } = c
  const { fid } = frameData || {} 

  const ids = MakeID(7);

  const action = `/${fid || 0}/dangs${ids}`;

  return c.res({
    image: (
      <Box height="100%" width="100%" backgroundSize="816px 426px" backgroundRepeat='no-repeat' backgroundImage={`url("${SITE_URL}/author.png")`}> </Box>
    ),
    intents: [
      <Button action={action} value='/'>Check $ENJOY Start</Button>
    ],
  })
})

app.frame('/bg/:secret', async (c) => {  
  console.log(1);
  
  const { frameData } = c
  const { fid } = frameData || {} 

  const ids = MakeID(7);

  const action = `/${fid || 0}/dangs${ids}`;

  return c.res({
    image: (
      <Box height="100%" width="100%" backgroundSize="816px 426px" backgroundRepeat='no-repeat' backgroundImage={`url("${SITE_URL}/author.png")`}> </Box>
    ),
    intents: [
      <Button action={action} value='/'>Check $ENJOY Start</Button>
    ],
  })
})

app.frame('/:fid/:secret', async (c) => {

  const { req, frameData } = c
  
  let { fid } = frameData || {};
  let { verifiedAddresses } = c.var.interactor || {};
  let { ethAddresses } = verifiedAddresses || {"ethAddresses": [""]};

  const regex = /\/([0-9]*)\/dangs[0-9a-zA-Z]{7}([0-9a-zA-Z]*)/gm;
  var regex_fid = parseInt([...req.url.matchAll(regex)][0][1]);
  var regex_address = [...req.url.matchAll(regex)][0][2];
  
  fid = regex_fid || fid;
  let address = regex_address || ethAddresses[0];
  
  var ids = MakeID(7);
  var action = `/${fid || 0}/dangs${ids}`;
  
  if (regex_fid) {
    var user = await fetch("https://client.warpcast.com/v2/user-by-fid?fid="+fid ,{ method:"GET" });
    var { result } = JSON.parse(await user.text()) || {};
  }

  var { displayName, username, pfpUrl, pfp } = c.var.interactor || result.user;
  pfpUrl = pfpUrl || pfp.url;

  if (fid != 368757) {
    var isFollow = await checkFollowed(username);

    if (!isFollow) {
      return c.res({
        image: (<Box height="100%" width="100%" backgroundSize="816px 426px" backgroundRepeat='no-repeat' backgroundImage={`url("${SITE_URL}/follow.png")`}> </Box>),
        intents: [
          <Button action={action} value='/'>Reload!</Button>,
          <Button.Link href="https://warpcast.com/dangs.eth">Follow Now!</Button.Link>
        ],
      })
    }
  }

  if (address == "" || !address) {
    return c.res({
      image: (<Box height="100%" width="100%" backgroundSize="816px 426px" backgroundRepeat='no-repeat' backgroundImage={`url("${SITE_URL}/404.png")`}> </Box>),
      intents: [
        <Button action={action} value='/'>Reload!</Button>,
        <Button.Link href="https://warpcast.com/dangs.eth">Follow Now!</Button.Link>
      ],
    })
  }

  var remaining = 0, tips_given = 0;
  var data = {"parameters":[{"name":"wallet","type":"string","value":address}]};
  var a = await fetch("https://api.usw2a1.rockset.com/v1/orgs/self/ws/frontend/lambdas/user_from_leaderboard/tags/latest" ,{ method:"POST", headers: {
    'Content-Type': 'application/json', 
    'Authorization': 'ApiKey 4caspW3wv3VHBmb8jHfYHXRulo39cLrQGlaqFyFMlgszKCcraI8hMoFznFwSdMRw'
  }, body: JSON.stringify(data)});
  var { results } = JSON.parse(await a.text());
  

  if (results.length) {
    results = results[0];

    var datac = {"parameters":[{"name":"wallet","type":"string","value":address}]};
    var a = await fetch("https://api.usw2a1.rockset.com/v1/orgs/self/ws/frontend/lambdas/current_tips_by_x/tags/latest" ,{ method:"POST", headers: {
      'Content-Type': 'application/json', 
      'Authorization': 'ApiKey 4caspW3wv3VHBmb8jHfYHXRulo39cLrQGlaqFyFMlgszKCcraI8hMoFznFwSdMRw'
    }, body: JSON.stringify(datac)});

    var current_tips = JSON.parse(await a.text()).results;

    if (current_tips.length > 0) {
      tips_given = current_tips[0].tips_given || 0;
    }

  } else {
    results = {};
  }
  var { balance, unique_mints, unique_collectors, allowance, score, rank } = results || {};
  allowance = parseInt(allowance || 0);
  remaining = allowance - tips_given;

  ids = MakeID(7);
  action = `/0/dangs${ids}`;
  const uriShare = encodeURI(`https://warpcast.com/~/compose?text=Check your $MASKS Stats. Frame by @dangs.eth &embeds[]=${SITE_URL}api/${fid}/dangs${ids}${address}`);

  return c.res({
    imageOptions: {
      height: 426,
      width: 816,
    },
    image: (
    <Box height="100%" width="100%" backgroundSize="816px 426px" backgroundRepeat='no-repeat' backgroundImage={`url("${SITE_URL}/bg.png")`}>
        <Rows paddingTop="12" paddingRight="12" paddingLeft="12" paddingBottom="0" gap="8" grow>
          <Row height="2/7" >
            { typeof displayName != "undefined" ? 
            <Columns gap="8" grow> 
              <Column width="1/7"> 
                <Image width="72" height="100%"borderRadius="192" objectFit='cover' src={pfpUrl || ""} />
              </Column>
              <Column alignVertical='center' width="6/7"> 
                <Heading color="white" size="20"> {displayName} </Heading>
                <Text color="white" size="14">@{username}</Text>
              </Column>
            </Columns> : "" }
          </Row>
          { Content(balance, remaining, unique_mints, unique_collectors, allowance, score) }
          <Row height="1/7" alignVertical='bottom'> <Text size="12" color="white" align='right'>frame design by @dangs.eth</Text> </Row>
        </Rows>
    </Box>
    ),
    intents: [
      <Button action={action} value='/'>Check Your</Button>,
      <Button.Link href={uriShare}>Share</Button.Link>
    ],
  })
})
// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
