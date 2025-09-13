import useToast from "../hooks/useToast"
import useModal from "../hooks/useModal";
import CreatableSearchSelect from "../components/CreatableSearchSelect";

function About() {
  const { showToast } = useToast();
  const [Modal, setShowModal] = useModal();
  return(
    <>
      <h1 className="text-2xl font-extrabold">About Us</h1>
      <p className="text-lg">
      Lorem ipsum odor amet, consectetuer adipiscing elit. Ad at placerat ultrices; ipsum habitant curae non. Ante gravida senectus fringilla nostra; tempus elementum curabitur non. Libero class nascetur quam; purus iaculis lacinia. Sed penatibus tempus augue id est malesuada interdum tincidunt. Erat mattis feugiat facilisis, nullam morbi hac mattis. Taciti senectus ut rhoncus tortor curabitur. Amet cubilia vivamus ultrices vehicula ultricies phasellus non. Parturient finibus potenti, morbi viverra eget vulputate.
      </p>
      <br />
      <p className="text-lg">
      Ac euismod diam ultricies torquent accumsan malesuada leo non. Lacus odio hendrerit sociosqu sagittis dapibus ac; rutrum platea velit. Proin vitae sollicitudin donec ut vivamus parturient. Ligula at in proin mollis justo morbi. Metus duis posuere id gravida; orci senectus dapibus elementum. Molestie urna felis non malesuada nascetur condimentum et id volutpat. Laoreet erat vivamus leo adipiscing sem; interdum bibendum elementum. Class torquent dictum natoque dapibus ad. Sit cras mi dis sodales lectus massa conubia ultricies.
      </p>
      <br />
      <p className="text-lg">
      Tortor mus fames vehicula, varius velit augue tincidunt interdum. Sit lobortis tempus purus ullamcorper metus. Natoque fusce facilisis in per fusce consequat aliquam tellus. Habitant massa a augue penatibus ornare vitae at nisl. Lacinia himenaeos sit lectus scelerisque id cras nostra auctor. Facilisis vulputate tincidunt ex hac eget torquent. Habitasse quisque tempus nisl ultrices curae? Bibendum cursus neque turpis odio ultricies ornare.
      </p>
      <br />
      <p className="text-lg">
        Dis risus est dui dis at. Donec facilisis congue cursus nam pretium est. Felis a habitasse sed ultricies ullamcorper. Taciti vestibulum mi vulputate; morbi egestas scelerisque convallis. Dolor sapien sed lobortis nam senectus leo feugiat mauris cras. Inceptos hac neque faucibus ipsum feugiat interdum cras montes feugiat. Nisi lectus fusce praesent volutpat etiam dolor litora. Id vestibulum mi eu adipiscing gravida arcu. Taciti semper lacinia, aliquet rutrum efficitur euismod.
      </p>
      <br />
      <p className="text-lg">
        Neque fringilla cursus aptent sagittis malesuada vel. Viverra per efficitur orci ligula inceptos nascetur magnis porta pharetra. Venenatis nisl hac ultricies ac porta nisl sociosqu quis ad. Interdum malesuada orci augue habitasse habitant lectus per. Amet vitae aliquet habitasse senectus himenaeos venenatis. Tristique molestie ante morbi adipiscing montes taciti vehicula. Mollis dolor semper curabitur posuere aliquet. Nascetur orci aptent odio; ad placerat nisl sit. Turpis montes faucibus cursus metus phasellus hac ad ipsum nascetur. Vivamus aptent ullamcorper pulvinar class sapien viverra non.
      </p>

      <button onClick={() => showToast('Default')} className="mt-5 p-5 rounded-2xl bg-blue-800 text-white">Show Default Toast</button>
      <button onClick={() => showToast('Success', 'success')} className="mt-5 p-5 rounded-2xl bg-green-800 text-white">Show Success Toast</button>
      <button onClick={() => showToast('Error', 'error')} className="mt-5 p-5 rounded-2xl bg-red-800 text-white">Show Error Toast</button>
      <button onClick={() => showToast('Warning', 'warning')} className="mt-5 p-5 rounded-2xl bg-yellow-300 text-black">Show Warning Toast</button>
      <button onClick={() => setShowModal(true)} className="mt-5 p-5 rounded-2xl bg-black text-white">Show Modal</button>

      <CreatableSearchSelect name="tags" labelName="Tags" required={true} />


      <Modal title="This is a test Modal">
        <p className="text-lg">
          Neque fringilla cursus aptent sagittis malesuada vel. Viverra per efficitur orci ligula inceptos nascetur magnis porta pharetra. Venenatis nisl hac ultricies ac porta nisl sociosqu quis ad. Interdum malesuada orci augue habitasse habitant lectus per. Amet vitae aliquet habitasse senectus himenaeos venenatis. Tristique molestie ante morbi adipiscing montes taciti vehicula. Mollis dolor semper curabitur posuere aliquet. Nascetur orci aptent odio; ad placerat nisl sit. Turpis montes faucibus cursus metus phasellus hac ad ipsum nascetur. Vivamus aptent ullamcorper pulvinar class sapien viverra non.
        </p>
      </Modal>
    </>
  )
}

export default About
