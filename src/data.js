const PB5_DATA = {
  football: {
    label:'サッカー', start:.01, end:4.8,
    src:'https://cdn.jsdelivr.net/gh/RockENZO/ML-object-detection-project@main/input_videos/08fd33_4.mp4',
    credit:'RockENZO / ML-object-detection-project', source:'https://github.com/RockENZO/ML-object-detection-project/blob/main/input_videos/08fd33_4.mp4',
    note:'白・黄緑のチームから4選手とボールを選択。俯瞰座標は手動で対応づけた模式表現で、ピッチ全体の選手を検出したものではありません。',
    case:'mixigame-state-reconstruction', apps:[['観戦体験','選手の配置も、映像と一緒に。'],['プレー分析','動きをたどり、プレーを振り返る。']],
    frames:[
      {t:0,W1:[.7385,.8315],W2:[.1974,.7608],G1:[.6123,.7373],G2:[.2894,.7249],ball:[.6227,.7943],halfTop:[.2218,.2503],halfBottom:[.2748,.9219]},
      {t:1.2,W1:[.5851,.8525],W2:[.1715,.7955],G1:[.6653,.8116],G2:[.3264,.7274],ball:[.5384,.8401],halfTop:[.2218,.2503],halfBottom:[.2748,.9219]},
      {t:2.4,W1:[.4275,.8389],W2:[.106,.8042],G1:[.5474,.8154],G2:[.3368,.7261],ball:[.311,.8079],halfTop:[.2566,.2429],halfBottom:[.3075,.917]},
      {t:3.6,W1:[.3961,.8426],W2:[.0969,.7683],G1:[.5586,.7782],G2:[.2699,.7274],ball:[.1388,.7398],halfTop:[.3577,.2466],halfBottom:[.3996,.8835]},
      {t:4.8,W1:[.4861,.7844],W2:[.2162,.6568],G1:[.6939,.7076],G2:[.3152,.6431],ball:[.2204,.6468],halfTop:[.5223,.285],halfBottom:[.5474,.8178]}
    ]
  },
  spaces: {
    label:'空間', start:20.2774, end:23.4574,
    src:'https://cdn.jsdelivr.net/gh/martinezpenya/ModelosIA@bc7dfeb0944edf621ed83f80748eeecba86be0be/docs/UD04/notebooks/EX1.-vtest.mp4',
    source:'https://github.com/martinezpenya/ModelosIA/blob/main/docs/UD04/notebooks/EX1.-vtest.mp4',credit:'OpenCV vtest / ModelosIA',
    note:'固定カメラの公開サンプルから3人を選択。外構と座標は模式表現で、清水建設の実際の映像・設備ではありません。',
    apps:[['空調の調整','人のいる場所に合わせて。'],['配置の見直し','空間の使われ方に合わせて。']],
    frames:[
      {t:20.2774,P02:[29.4,44.8],P03:[64.2,38.7],P04:[84.4,64.2]},
      {t:21.0724,P02:[22.1,43.8],P03:[58.4,39.5],P04:[88,70]},
      {t:21.8674,P02:[16.4,43.1],P03:[50.5,40.8],P04:[81.1,70.7]},
      {t:22.6624,P02:[10.5,42.7],P03:[43.6,41],P04:[72.4,67.4]},
      {t:23.4574,P02:[7.4,42],P03:[37.2,40.6],P04:[65.5,63.2]}
    ]
  },
  work: {
    label:'作業',start:.04,end:2.08,
    src:'https://cdn.jsdelivr.net/gh/TimSchoonbeek/timschoonbeek.github.io@80412a16c65633a5b7996e7fba391628139f9d84/publications/industreal_teaser.mp4',
    source:'https://data.4tu.nl/datasets/b008dd74-020d-4ea4-a8ba-7bb60769d224',credit:'IndustReal / Schoonbeek et al. · Apache-2.0',
    note:'冒頭の約2秒、上段のRGB映像を使用。手と部品の接触位置に合わせた模式表現で、作業完了の判定は行っていません。',
    apps:[['作業記録','作業の流れを、見返せる記録に。'],['映像検索','見たい作業から、映像を探す。']],
    frames:[{t:.09,point:[.477,.618]},{t:.94,point:[.454,.672]},{t:1.98,point:[.448,.747]}]
  },
  racing: {
    label:'競馬',start:20.972886,end:26.565686,
    src:'https://streaminghkjc-a.akamaihd.net/hdflash/replay-full/2025/20250131/08/eng/replay-full_20250131_08_eng_1200kbps.mp4',
    source:'https://racing.hkjc.com/en-us/local/information/localresults?RaceNo=8&Racecourse=ST&racedate=2025%2F01%2F31',credit:'The Hong Kong Jockey Club · 2025年1月31日 第8競走',
    note:'選択した3頭の相対的な間隔を表示。追従カメラのためコース全体の座標・速度は表していません。横方向の配置は模式表現です。映像は公式配信を直接参照しており、公開サイトへの転用には素材の利用許諾確認が必要です。',
    apps:[['観戦体験','各馬の位置を、映像と一緒に。'],['レース分析','動きをたどり、展開を振り返る。']],
    frames:[
      {t:20.972886,H01:[.8622,.5825],H02:[.742,.5774],H03:[.6454,.5707]},
      {t:22.371086,H01:[.8859,.5909],H02:[.7533,.5758],H03:[.6738,.5825]},
      {t:23.769286,H01:[.884,.5926],H02:[.7495,.5842],H03:[.6813,.5859]},
      {t:25.167486,H01:[.8764,.5892],H02:[.7448,.5791],H03:[.6842,.5808]},
      {t:26.565686,H01:[.8935,.5758],H02:[.7723,.5774],H03:[.7192,.5741]}
    ]
  },
  retail: {
    label:'店舗',start:0,end:6.047639,
    src:'https://cdn.jsdelivr.net/gh/ai-rtistic/Project_Argos@5f6b0dd80fe54cc920f33e18285c6b44b601c45c/supermarket.mp4',
    source:'https://github.com/ai-rtistic/Project_Argos/blob/main/supermarket.mp4',credit:'ai-rtistic / Project_Argos · supermarket.mp4',
    note:'レジ周辺の2人を選択。足元を手動で読み取り、模式的な売り場の位置へ対応づけています。店舗全体の混雑やスタッフの最適人数を算出したものではありません。',
    apps:[['売り場づくり','人の流れを見て、配置を見直す。'],['スタッフ配置','混雑に合わせて、人員を調整。']],
    frames:[
      {t:0,R01:[.66,.37],R02:[.70,.68]},
      {t:2.020445,R01:[.68,.45],R02:[.70,.68]},
      {t:4.047740,R01:[.66,.37],R02:[.70,.68]},
      {t:6.047639,R01:[.66,.35],R02:[.70,.68]}
    ]
  }
};
