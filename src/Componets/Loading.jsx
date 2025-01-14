import { Grid } from "react-loader-spinner";


const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Grid
                visible={true}
                height="80"
                width="80"
                color="#00B5FF"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass="grid-wrapper"
            />
     </div>
    );
};

export default Loading;